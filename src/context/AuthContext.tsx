import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, onAuthStateChanged, signOut as firebaseSignOut, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

// Session management constants
const SESSION_USER_KEY = "cabinet_user";
const SESSION_TENANT_KEY = "cabinet_tenant";
const SESSION_ROLE_KEY = "cabinet_role";
const SESSION_EXPIRY_KEY = "cabinet_session_expiry";

interface AuthContextType {
  user: User | null;
  tenantId: string | null;
  role: string | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = () => {
      try {
        const sessionUser = localStorage.getItem(SESSION_USER_KEY);
        const tenantId = localStorage.getItem(SESSION_TENANT_KEY);
        const role = localStorage.getItem(SESSION_ROLE_KEY);
        const expiryTime = localStorage.getItem(SESSION_EXPIRY_KEY);
        
        if (sessionUser && expiryTime && tenantId && role) {
          // Check if session is still valid
          if (Date.now() < parseInt(expiryTime)) {
            // Session is valid, set user data
            setTenantId(tenantId);
            setRole(role);
            // We don't set the user here as Firebase will handle that
          } else {
            // Session expired, clear it
            localStorage.removeItem(SESSION_USER_KEY);
            localStorage.removeItem(SESSION_TENANT_KEY);
            localStorage.removeItem(SESSION_ROLE_KEY);
            localStorage.removeItem(SESSION_EXPIRY_KEY);
          }
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };
    
    // Check session first
    checkSession();
    
    // Then set up Firebase auth listener
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        // If we don't have tenant and role from session, get from Firestore
        if (!tenantId || !role) {
          try {
            const userDoc = await getDoc(doc(db, `users/${currentUser.uid}`));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              setTenantId(userData.tenantId || null);
              setRole(userData.role || null);
              
              // Update session with this data
              if (userData.tenantId && userData.role) {
                localStorage.setItem(SESSION_TENANT_KEY, userData.tenantId);
                localStorage.setItem(SESSION_ROLE_KEY, userData.role);
              }
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        }
      } else {
        // No Firebase user, check if we have a session
        const sessionUser = localStorage.getItem(SESSION_USER_KEY);
        const sessionTenant = localStorage.getItem(SESSION_TENANT_KEY);
        const sessionRole = localStorage.getItem(SESSION_ROLE_KEY);
        const expiryTime = localStorage.getItem(SESSION_EXPIRY_KEY);
        
        if (sessionUser && expiryTime && Date.now() < parseInt(expiryTime)) {
          // We have a valid session but Firebase doesn't know about it
          // This can happen on page refresh
          // Keep the tenant and role data
          setTenantId(sessionTenant);
          setRole(sessionRole);
        } else {
          // No valid session, clear everything
          setUser(null);
          setTenantId(null);
          setRole(null);
        }
      }
      
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, `users/${userCredential.user.uid}`));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userTenantId = userData.tenantId || null;
        const userRole = userData.role || null;
        
        setTenantId(userTenantId);
        setRole(userRole);
        
        // Save session data
        const sessionUser = {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName,
          photoURL: userCredential.user.photoURL
        };
        
        localStorage.setItem(SESSION_USER_KEY, JSON.stringify(sessionUser));
        
        if (userTenantId) {
          localStorage.setItem(SESSION_TENANT_KEY, userTenantId);
        }
        
        if (userRole) {
          localStorage.setItem(SESSION_ROLE_KEY, userRole);
        }
        
        // Set session expiry (7 days from now)
        const expiryTime = Date.now() + (7 * 24 * 60 * 60 * 1000);
        localStorage.setItem(SESSION_EXPIRY_KEY, expiryTime.toString());
      }
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      
      // Clear session data
      localStorage.removeItem(SESSION_USER_KEY);
      localStorage.removeItem(SESSION_TENANT_KEY);
      localStorage.removeItem(SESSION_ROLE_KEY);
      localStorage.removeItem(SESSION_EXPIRY_KEY);
      
      setUser(null);
      setTenantId(null);
      setRole(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, tenantId, role, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}