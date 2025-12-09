// src/components/BottomNavbar.jsx
import React, { useState } from 'react';
import { Home as HomeIcon, BookText, CalendarDays, UserCircle } from 'lucide-react';

const BottomNavbar = () => {
    const [activeTab, setActiveTab] = useState('home');

    const navItems = [
        { name: 'home', icon: HomeIcon, label: 'Home' },
        { name: 'estante', icon: BookText, label: 'Estante' },
        { name: 'encontros', icon: CalendarDays, label: 'Encontros' },
        { name: 'perfil', icon: UserCircle, label: 'Perfil' },
    ];

    return (
        <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
            <div className="bg-white rounded-full shadow-xl border border-stone-100 p-2 flex space-x-4 max-w-fit">
                {navItems.map((item) => (
                    <button
                        key={item.name}
                        onClick={() => setActiveTab(item.name)}
                        className={`flex flex-col items-center justify-center p-2 rounded-full transition-all duration-300
              ${activeTab === item.name
                                ? 'bg-brand-50 text-brand-700 shadow-md ring-2 ring-brand-100' // Fundo mais evidente para o ativo
                                : 'text-stone-500 hover:text-brand-600'
                            }`}
                    >
                        <item.icon
                            className={`w-6 h-6 ${activeTab === item.name ? 'fill-current' : ''}`}
                            strokeWidth={activeTab === item.name ? 2.5 : 2} // Ícone mais "bold" quando ativo
                        />
                        {/* <span className="text-xs mt-1 font-medium">{item.label}</span> {/* Opcional: mostrar labels */} */
                    </button>
                ))}
            </div>
        </nav>
    );
};

export default BottomNavbar;
