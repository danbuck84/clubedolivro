// Navbar.jsx
// Barra de navegação flutuante estilo NanoBanana

import React from 'react';
import { Home, BookOpen, Calendar, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const activeTab = location.pathname;

    const navItems = [
        { path: '/', icon: Home, label: 'Home' },
        { path: '/estante', icon: BookOpen, label: 'Estante' },
        { path: '/encontros', icon: Calendar, label: 'Encontros' },
        { path: '/perfil', icon: User, label: 'Perfil' },
    ];

    return (
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4">
            <div className="bg-white/90 backdrop-blur-md rounded-full shadow-xl border border-stone-200/50 p-2 flex justify-between items-center px-6">
                {navItems.map((item) => (
                    <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={`flex flex-col items-center justify-center p-2 rounded-full transition-all duration-300 relative group
                        ${activeTab === item.path ? 'text-brand-700' : 'text-stone-400 hover:text-brand-600'}`}
                    >
                        <item.icon
                            className={`w-6 h-6 transition-transform duration-300 ${activeTab === item.path ? 'scale-110 fill-brand-100' : 'group-hover:scale-105'}`}
                            strokeWidth={activeTab === item.path ? 2.5 : 2}
                        />
                        {activeTab === item.path && (
                            <span className="absolute -bottom-1 w-1 h-1 bg-brand-600 rounded-full"></span>
                        )}
                    </button>
                ))}
            </div>
        </nav>
    );
};

export default Navbar;
