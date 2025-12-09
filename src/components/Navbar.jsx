// Navbar.jsx
// Bottom Tab Bar para navegação mobile-first

import { Home, BookMarked, Users, User } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

export default function Navbar() {
    const location = useLocation();

    const navItems = [
        {
            name: 'Home',
            path: '/',
            icon: Home,
        },
        {
            name: 'Estante',
            path: '/estante',
            icon: BookMarked,
        },
        {
            name: 'Encontros',
            path: '/encontros',
            icon: Users,
        },
        {
            name: 'Perfil',
            path: '/perfil',
            icon: User,
        },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 backdrop-blur-lg bg-white/95 z-50 safe-area-bottom">
            <div className="max-w-lg mx-auto px-4">
                <div className="flex items-center justify-around py-3">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${isActive
                                        ? 'text-amber-600'
                                        : 'text-stone-400 hover:text-stone-600'
                                    }`}
                            >
                                <Icon
                                    className={`w-6 h-6 transition-transform ${isActive ? 'scale-110' : ''
                                        }`}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                                <span
                                    className={`text-xs font-medium ${isActive ? 'font-semibold' : ''
                                        }`}
                                >
                                    {item.name}
                                </span>
                                {isActive && (
                                    <div className="absolute -bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-amber-600 rounded-full" />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
