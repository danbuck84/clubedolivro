// src/pages/Home.jsx
import React from 'react';
import { BookText, CalendarDays, Users, Home as HomeIcon, Bookmark, UserCircle } from 'lucide-react'; // Importando ícones Lucide

const HomePage = () => {
    return (
        <div className="min-h-screen bg-stone-50 text-stone-900 font-sans p-4 pb-20"> {/* Adicionado pb-20 para não sobrepor a navbar */}
            {/* Header */}
            <header className="flex items-center justify-between py-4">
                <h1 className="font-serif text-3xl font-bold text-stone-900">Bom dia, Dan</h1>
                <div className="relative">
                    <img
                        src="https://api.lorem.space/image/face?w=150&h=150" // Avatar de exemplo
                        alt="User Avatar"
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-stone-200"
                    />
                </div>
            </header>

            {/* Seção "Lendo Agora" */}
            <section className="mt-8">
                <h2 className="text-xl font-serif font-semibold mb-4">Lendo Agora</h2>
                <div className="bg-white rounded-xl shadow-lg border border-stone-100 p-6 flex items-center space-x-6 relative overflow-hidden">
                    {/* Fundo sutil para o card de livro - opcional */}
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-stone-50 opacity-20 -z-10"></div>

                    <img
                        src="https://api.lorem.space/image/book?w=150&h=200" // Capa de livro de exemplo
                        alt="Capa do Livro"
                        className="w-24 h-36 rounded-lg shadow-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-grow">
                        <h3 className="font-serif text-xl font-bold text-stone-900 leading-tight">O Nome do Vento</h3>
                        <p className="text-stone-500 text-sm mt-1">Patrick Rothfuss</p>

                        <div className="mt-4">
                            <p className="text-stone-700 text-sm font-medium">Página 120 de 300</p>
                            <div className="w-full bg-stone-200 rounded-full h-2.5 mt-1">
                                <div
                                    className="bg-gradient-to-r from-brand-300 to-brand-500 h-2.5 rounded-full"
                                    style={{ width: `${(120 / 300) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        <button className="mt-5 px-5 py-2 text-sm font-medium text-brand-700 border border-brand-300 rounded-full hover:bg-brand-50 transition-colors duration-200">
                            Atualizar Progresso
                        </button>
                    </div>
                </div>
            </section>

            {/* Seção "Próximo Encontro" */}
            <section className="mt-8">
                <h2 className="text-xl font-serif font-semibold mb-4">Próximo Encontro</h2>
                <div className="bg-white rounded-xl shadow-lg border border-stone-100 p-6 relative overflow-hidden">
                    {/* Efeito de ticket/ingresso - sutil */}
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-stone-50 rounded-full border-r border-dashed border-stone-200"></div>
                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-stone-50 rounded-full border-l border-dashed border-stone-200"></div>


                    <div className="flex items-center space-x-4 mb-4">
                        <div className="flex-shrink-0 text-center">
                            <p className="text-4xl font-serif font-bold text-brand-700 leading-none">15</p>
                            <p className="text-sm uppercase text-stone-500 font-medium">JAN</p>
                        </div>
                        <div>
                            <h3 className="font-serif text-lg font-bold text-stone-900">Debate: "O Conto da Aia"</h3>
                            <p className="text-stone-500 text-sm mt-1">Cafeteria Central • 19:00h</p>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between">
                        <p className="text-stone-500 text-sm">Confirmados:</p>
                        <div className="flex -space-x-2">
                            <img
                                src="https://api.lorem.space/image/face?w=40&h=40&r=1"
                                alt="Avatar 1"
                                className="w-8 h-8 rounded-full object-cover border-2 border-white"
                            />
                            <img
                                src="https://api.lorem.space/image/face?w=40&h=40&r=2"
                                alt="Avatar 2"
                                className="w-8 h-8 rounded-full object-cover border-2 border-white"
                            />
                            <img
                                src="https://api.lorem.space/image/face?w=40&h=40&r=3"
                                alt="Avatar 3"
                                className="w-8 h-8 rounded-full object-cover border-2 border-white"
                            />
                            <div className="w-8 h-8 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center text-xs font-medium border-2 border-white">
                                +5
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mais seções podem ser adicionadas aqui */}
        </div>
    );
};

export default HomePage;
