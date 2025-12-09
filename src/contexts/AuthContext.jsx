// AuthContext.jsx
// Contexto de autenticação para gerenciar sessão do usuário

import { createContext, useContext, useEffect, useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import { checkOrCreateUser } from '../services/userService';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Monitorar mudanças no estado de autenticação
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Usuário logado - verificar/criar perfil no Firestore
                await checkOrCreateUser(firebaseUser);
                setUser(firebaseUser);
            } else {
                // Usuário deslogado
                setUser(null);
            }
            setLoading(false);
        });

        // Cleanup: cancelar inscrição ao desmontar
        return () => unsubscribe();
    }, []);

    // Login com Google
    const loginWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({
                prompt: 'select_account'
            });
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            throw error;
        }
    };

    // Logout
    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            throw error;
        }
    };

    const value = {
        user,
        loading,
        loginWithGoogle,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook customizado para usar o contexto
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
}
