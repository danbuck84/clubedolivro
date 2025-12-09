// Home.jsx
// Dashboard NanoBanana com ticket style

import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-stone-50 text-stone-900 font-sans p-6 pb-28">
            {/* Header */}
            <header className="flex items-center justify-between py-2 mb-8">
                <div>
                    <h1 className="font-serif text-3xl font-bold text-stone-900">
                        Bom dia, {user?.displayName?.split(' ')[0] || 'Leitor'}
                    </h1>
                    <p className="text-stone-500 text-sm">Vamos ler um pouco hoje?</p>
                </div>
                <div className="relative">
                    <img
                        src={user?.photoURL || "https://ui-avatars.com/api/?name=User&background=random"}
                        alt="User Avatar"
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-stone-200 p-0.5 bg-white shadow-sm"
                    />
                </div>
            </header>

            {/* Seção "Lendo Agora" */}
            <section className="mb-10">
                <div className="flex justify-between items-baseline mb-4">
                    <h2 className="text-xl font-serif font-bold text-stone-800">Lendo Agora</h2>
                    <button className="text-brand-700 text-sm font-medium hover:underline">Ver estante</button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5 flex gap-5 relative overflow-hidden group hover:shadow-md transition-shadow">
                    {/* Efeito de fundo */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-bl-full -mr-10 -mt-10 opacity-50"></div>

                    <img
                        src="https://placehold.co/400x600/ed943f/white?text=Capa+Livro"
                        alt="O Nome do Vento"
                        className="w-24 h-36 rounded-lg shadow-lg object-cover flex-shrink-0 z-10 rotate-1 group-hover:rotate-0 transition-transform duration-300"
                    />
                    <div className="flex-grow z-10 flex flex-col justify-between py-1">
                        <div>
                            <h3 className="font-serif text-lg font-bold text-stone-900 leading-tight mb-1">O Nome do Vento</h3>
                            <p className="text-stone-500 text-sm font-medium">Patrick Rothfuss</p>
                        </div>

                        <div className="mt-4">
                            <div className="flex justify-between text-xs font-semibold text-stone-600 mb-2">
                                <span>Página 120</span>
                                <span className="text-stone-400">de 656</span>
                            </div>
                            <div className="w-full bg-stone-100 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-brand-400 to-brand-600 h-2 rounded-full"
                                    style={{ width: '18%' }}
                                ></div>
                            </div>
                        </div>

                        <button className="mt-4 w-full py-2 text-xs font-bold uppercase tracking-wide text-brand-700 border border-brand-200 rounded-lg hover:bg-brand-50 transition-colors">
                            Atualizar Leitura
                        </button>
                    </div>
                </div>
            </section>

            {/* Seção "Próximo Encontro" (Ticket Style) */}
            <section>
                <h2 className="text-xl font-serif font-bold text-stone-800 mb-4">Próximo Encontro</h2>
                <div className="bg-white rounded-2xl shadow-sm border border-stone-100 relative overflow-hidden">
                    {/* Recortes do Ticket */}
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-stone-50 rounded-full border border-stone-100"></div>
                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-stone-50 rounded-full border border-stone-100"></div>
                    <div className="absolute left-4 right-4 top-1/2 border-t-2 border-dashed border-stone-100"></div>

                    <div className="p-5 pb-8">
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col items-center bg-brand-50 rounded-xl p-3 border border-brand-100 min-w-[70px]">
                                <span className="text-brand-800 font-bold text-3xl font-serif leading-none">15</span>
                                <span className="text-brand-600 text-xs font-bold uppercase tracking-wider mt-1">Jan</span>
                            </div>
                            <div className="ml-4 flex-grow">
                                <h3 className="font-serif text-lg font-bold text-stone-900">Debate: "O Conto da Aia"</h3>
                                <div className="flex items-center text-stone-500 text-sm mt-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                                    Cafeteria Central • 19:00h
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-stone-50/50 p-4 flex items-center justify-between border-t border-stone-100">
                        <span className="text-xs font-medium text-stone-500">Quem vai:</span>
                        <div className="flex -space-x-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-stone-200 overflow-hidden">
                                    <img src={`https://ui-avatars.com/api/?name=User+${i}&background=ffb56b&color=fff`} alt="" />
                                </div>
                            ))}
                            <div className="w-8 h-8 rounded-full border-2 border-white bg-stone-900 text-white flex items-center justify-center text-xs font-bold">
                                +5
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
