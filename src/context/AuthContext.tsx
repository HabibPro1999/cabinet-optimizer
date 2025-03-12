import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';

interface AuthContextType {
    tenantId: string | null;
    role: string | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    tenantId: null,
    role: null,
    loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [tenantId, setTenantId] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onIdTokenChanged(async (user) => {
            if (user) {
                const idTokenResult = await user.getIdTokenResult();
                setTenantId(idTokenResult.claims.tenantId as string);
                setRole(idTokenResult.claims.role as string);
            } else {
                setTenantId(null);
                setRole(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ tenantId, role, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);