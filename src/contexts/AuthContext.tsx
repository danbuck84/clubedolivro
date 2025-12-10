"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import {
    User,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { createOrUpdateUser } from "@/services/userService";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);

            // Create or update user document in Firestore
            if (user) {
                await createOrUpdateUser({
                    uid: user.uid,
                    email: user.email || "",
                    displayName: user.displayName || "",
                    photoURL: user.photoURL || "",
                });
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Error signing in with Google:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out:", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout }}>
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
