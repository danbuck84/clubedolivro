// Home.jsx
// Página inicial (placeholder para testes)

import { BookOpen, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <BookOpen className="w-8 h-8 text-purple-600" />
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            BookClub
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            {user?.photoURL && (
                                <img
                                    src={user.photoURL}
                                    alt={user.displayName}
                                    className="w-10 h-10 rounded-full border-2 border-purple-600"
                                />
                            )}
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {user?.displayName}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {user?.email}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="Sair"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Conteúdo Principal */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Bem-vindo ao BookClub! 📚
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Sistema de autenticação funcionando perfeitamente!
                    </p>
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 max-w-md mx-auto">
                        <p className="text-green-700 dark:text-green-400 font-medium">
                            ✅ Você está autenticado!
                        </p>
                        <p className="text-sm text-green-600 dark:text-green-500 mt-2">
                            Seu perfil foi criado/atualizado no Firestore
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
