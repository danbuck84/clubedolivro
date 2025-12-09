// Home.jsx
// Página inicial

import { BookOpen, LogOut, BookMarked } from 'lucide-react';
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

    // Pegar primeiro nome do usuário
    const firstName = user?.displayName?.split(' ')[0] || 'Leitor';

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-amber-600 to-orange-700 p-2 rounded-lg">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-serif font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'Georgia, serif' }}>
                            Clube do Livro
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            {user?.photoURL && (
                                <img
                                    src={user.photoURL}
                                    alt={user.displayName}
                                    className="w-10 h-10 rounded-full border-2 border-amber-600 shadow"
                                />
                            )}
                            <div className="text-right hidden sm:block">
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
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Saudação */}
                <div className="mb-8">
                    <h2 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                        Olá, {firstName}! 👋
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Bem-vindo de volta à sua biblioteca pessoal
                    </p>
                </div>

                {/* Card da Estante Vazia */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-center mb-6">
                        <div className="bg-amber-100 dark:bg-amber-900/20 p-6 rounded-full">
                            <BookMarked className="w-16 h-16 text-amber-600 dark:text-amber-500" />
                        </div>
                    </div>

                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                        Sua estante está vazia
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 text-lg mb-6 max-w-md mx-auto">
                        O que vamos ler este mês? 📚
                    </p>

                    <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg p-4 max-w-md mx-auto">
                        <p className="text-amber-800 dark:text-amber-400 text-sm">
                            Em breve você poderá adicionar livros, acompanhar seu progresso e participar dos encontros do clube!
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
