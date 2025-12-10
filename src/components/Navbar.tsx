"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Calendar, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/", icon: Home, label: "Início" },
    { href: "/estante", icon: BookOpen, label: "Estante" },
    { href: "/encontros", icon: Calendar, label: "Encontros" },
    { href: "/busca", icon: Search, label: "Buscar" },
    { href: "/perfil", icon: User, label: "Perfil" },
];

export function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 safe-area-inset-bottom z-50">
            <div className="flex justify-around items-center h-16 max-w-2xl mx-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center flex-1 h-full transition-colors",
                                isActive
                                    ? "text-amber-600"
                                    : "text-stone-500 hover:text-stone-700"
                            )}
                        >
                            <Icon className={cn("w-6 h-6", isActive && "stroke-[2.5]")} />
                            <span
                                className={cn(
                                    "text-xs mt-1",
                                    isActive ? "font-bold" : "font-medium"
                                )}
                            >
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
