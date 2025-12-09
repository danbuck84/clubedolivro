// Profile.jsx
// Página de perfil do usuário com logout

import React, { useState, useEffect } from 'react';
import { LogOut, BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getUserLibrary } from '../services/shelfService';

export default function Profile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [libraryCount, setLibraryCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStats() {
            if (!user) return;

            try {
                const library = await getUserLibrary(user.uid);
                setLibraryCount(library.length);
            } catch (error) {
                console.error('Erro ao carregar estatísticas:', error);
            } finally {
                setLoading(false);
            }
        }

        loadStats();
    }, [user]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-stone-50 text-stone-900 font-sans p-6 pb-28">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <h1 className="font-serif text-3xl font-bold text-stone-900 mb-8 text-center">
                    Meu Perfil
                </h1>

                {/* Card do Perfil */}
                <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
                    {/* Avatar e Nome */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="mb-4">
                            <img
                                src={user.photoURL || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.displayName || 'User') + "&background=ffb56b&color=fff&size=200"}
                                alt={user.displayName}
                                className="w-32 h-32 rounded-full object-cover ring-4 ring-brand-100 shadow-lg"
                            />
                        </div>

                        <h2 className="font-serif text-2xl font-bold text-stone-900 mb-1">
                            {user.displayName || 'Usuário'}
                        </h2>

                        <p className="text-stone-500 text-sm">
                            {user.email}
                        </p>
                    </div>

                    {/* Estatísticas */}
                    <div className="bg-stone-50 rounded-xl p-6 mb-6">
                        <div className="flex items-center justify-center gap-3">
                            <BookOpen className="w-6 h-6 text-brand-600" />
                            <div className="text-center">
                                {loading ? (
                                    <p className="text-stone-500">Carregando...</p>
                                ) : (
                                    <>
                                        <p className="text-3xl font-bold text-stone-900 font-serif">
                                            {libraryCount}
                                        </p>
                                        <p className="text-sm text-stone-500">
                                            {libraryCount === 1 ? 'livro na estante' : 'livros na estante'}
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Informações Adicionais */}
                    <div className="border-t border-stone-100 pt-6 mb-6">
                        <h3 className="font-semibold text-stone-700 mb-3 text-sm uppercase tracking-wide">
                            Informações da Conta
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-stone-500">Método de Login:</span>
                                <span className="text-stone-900 font-medium">Google</span>
                            </div>
                        </div>
                    </div>

                    {/* Botão de Logout */}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 bg-white text-red-600 border-2 border-red-200 font-medium py-3 px-6 rounded-xl hover:bg-red-50 hover:border-red-300 transition-all shadow-sm"
                    >
                        <LogOut className="w-5 h-5" />
                        Sair da Conta
                    </button>
                </div>

                {/* Footer Info */}
                <p className="text-center text-xs text-stone-400 mt-6">
                    Clube do Livro • 2024
                </p>
            </div>
        </div>
    );
}
