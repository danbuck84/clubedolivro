// ProtectedRoute.jsx
// Componente para proteger rotas que exigem autenticação

import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    // Mostra loading enquanto verifica a autenticação
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
                </div>
            </div>
        );
    }

    // Se não estiver autenticado, redireciona para login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Se autenticado, renderiza o conteúdo
    return children;
}
