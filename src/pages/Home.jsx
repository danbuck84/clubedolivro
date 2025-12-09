// Home.jsx
// Página inicial

import { LogOut, BookOpen } from 'lucide-react';
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
        <div className="min-h-screen bg-stone-50 pb-24">
            {/* Header simplificado */}
            <header className="bg-white border-b border-stone-200 sticky top-0 z-40">
                <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {user?.photoURL && (
                            <img
                                src={user.photoURL}
                                alt={user.displayName}
                                className="w-12 h-12 rounded-full ring-2 ring-amber-100 shadow-sm"
                            />
                        )}
                        <div>
                            <h1 
                                className="text-2xl font-serif font-bold text-stone-900" 
                                style={{ fontFamily: 'Georgia, serif' }}
                            >
                                Olá, {firstName}
                            </h1>
                            <p className="text-xs text-stone-500">
                                Sua biblioteca pessoal
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="p-2.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-xl transition-colors"
                        title="Sair"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* Conteúdo Principal */}
            <main className="max-w-2xl mx-auto px-4 py-8">
                {/* Card da Estante Vazia */}
                <div className="bg-white rounded-3xl shadow-md p-10 text-center border border-stone-200">
                    <div className="flex justify-center mb-6">
                        <div className="bg-amber-50 p-8 rounded-2xl">
                            <BookOpen className="w-20 h-20 text-amber-600" strokeWidth={1.5} />
                        </div>
                    </div>
                    
                    <h2 
                        className="text-3xl font-serif font-bold text-stone-900 mb-3"
                        style={{ fontFamily: 'Georgia, serif' }}
                    >
                        Sua estante está vazia
                    </h2>
                    
                    <p className="text-stone-600 text-lg mb-8 max-w-md mx-auto">
                        O que vamos ler este mês? 📚
                    </p>

                    {/* CTA Button */}
                    <button className="w-full bg-stone-900 text-white px-8 py-4 rounded-xl font-medium hover:bg-stone-800 transition-colors shadow-sm">
                        Adicionar Primeiro Livro
                    </button>

                    {/* Info Box */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-6">
                        <p className="text-amber-900 text-sm leading-relaxed">
                            <span className="font-semibold">Em breve:</span> Adicione livros, acompanhe seu progresso<br />
                            e participe dos encontros do clube!
                        </p>
                    </div>
                </div>

                {/* Stats Placeholder (futuro) */}
                <div className="grid grid-cols-3 gap-3 mt-6">
                    <div className="bg-white rounded-2xl p-4 text-center border border-stone-200">
                        <div className="text-2xl font-bold text-stone-900">0</div>
                        <div className="text-xs text-stone-500 mt-1">Lendo</div>
                    </div>
                    <div className="bg-white rounded-2xl p-4 text-center border border-stone-200">
                        <div className="text-2xl font-bold text-stone-900">0</div>
                        <div className="text-xs text-stone-500 mt-1">Lidos</div>
                    </div>
                    <div className="bg-white rounded-2xl p-4 text-center border border-stone-200">
                        <div className="text-2xl font-bold text-stone-900">0</div>
                        <div className="text-xs text-stone-500 mt-1">Quero Ler</div>
                    </div>
                </div>
            </main>
        </div>
    );
}
