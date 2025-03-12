import { User } from "firebase/auth";

// Session keys
const SESSION_USER_KEY = "cabinet_user";
const SESSION_EXPIRY_KEY = "cabinet_session_expiry";
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

/**
 * Save user session to localStorage
 */
export const saveSession = (user: User | null) => {
    if (!user) {
        clearSession();
        return;
    }

    // Store only necessary user information
    const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
    };

    // Set expiry time
    const expiryTime = Date.now() + SESSION_DURATION;

    // Save to localStorage
    localStorage.setItem(SESSION_USER_KEY, JSON.stringify(userData));
    localStorage.setItem(SESSION_EXPIRY_KEY, expiryTime.toString());
};

/**
 * Get user session from localStorage
 */
export const getSession = () => {
    try {
        const userDataString = localStorage.getItem(SESSION_USER_KEY);
        const expiryTimeString = localStorage.getItem(SESSION_EXPIRY_KEY);

        if (!userDataString || !expiryTimeString) {
            return null;
        }

        // Check if session has expired
        const expiryTime = parseInt(expiryTimeString, 10);
        if (Date.now() > expiryTime) {
            clearSession();
            return null;
        }

        // Return user data
        return JSON.parse(userDataString);
    } catch (error) {
        console.error("Error retrieving session:", error);
        clearSession();
        return null;
    }
};

/**
 * Clear user session from localStorage
 */
export const clearSession = () => {
    localStorage.removeItem(SESSION_USER_KEY);
    localStorage.removeItem(SESSION_EXPIRY_KEY);
};

/**
 * Refresh session expiry time
 */
export const refreshSession = () => {
    const expiryTimeString = localStorage.getItem(SESSION_EXPIRY_KEY);
    if (expiryTimeString) {
        const newExpiryTime = Date.now() + SESSION_DURATION;
        localStorage.setItem(SESSION_EXPIRY_KEY, newExpiryTime.toString());
    }
};