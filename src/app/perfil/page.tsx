"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { toHttps } from "@/lib/utils";

export default function ProfilePage() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50">
                <Loader2 className="w-10 h-10 text-amber-600 animate-spin" />
            </div>
        );
    }

    if (!user) {
        router.push("/login");
        return null;
    }

    return (
        <div className="min-h-screen bg-stone-50 pb-20">
            <main className="max-w-2xl mx-auto p-6">
                {/* Header */}
                <header className="mb-8">
                    <h1 className="font-serif text-4xl font-bold text-stone-900">
                        Perfil
                    </h1>
                </header>

                {/* User Info Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 mb-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-amber-200 flex-shrink-0 relative">
                            <Image
                                src={toHttps(user.photoURL)}
                                alt={user.displayName || ""}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex-grow min-w-0">
                            <h2 className="font-serif text-2xl font-bold text-stone-900 truncate">
                                {user.displayName}
                            </h2>
                            <p className="text-stone-600 truncate">{user.email}</p>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <Button
                        onClick={logout}
                        variant="outline"
                        className="w-full border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                        Sair da Conta
                    </Button>
                </div>

                {/* Info Box */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
                    <p className="text-amber-900 font-medium mb-2">
                        👋 Olá, {user.displayName?.split(" ")[0]}!
                    </p>
                    <p className="text-amber-800 text-sm">
                        Você está logado no Clube do Livro
                    </p>
                </div>
            </main>

            <Navbar />
        </div>
    );
}
