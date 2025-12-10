"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { BookDetailsModal } from "@/components/BookDetailsModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getUserBooks, Book } from "@/services/shelfService";
import { Loader2, Plus, BookOpen } from "lucide-react";
import Image from "next/image";
import { toHttps } from "@/lib/utils";

export default function MyShelfPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [activeTab, setActiveTab] = useState("lendo");

    useEffect(() => {
        if (!user) {
            router.push("/login");
            return;
        }
        loadBooks();
    }, [user, router]);

    async function loadBooks() {
        if (!user) return;
        try {
            const data = await getUserBooks(user.uid);
            setBooks(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const booksByStatus = {
        "quero-ler": books.filter((b) => b.status === "quero-ler"),
        lendo: books.filter((b) => b.status === "lendo"),
        lido: books.filter((b) => b.status === "lido"),
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50">
                <Loader2 className="w-10 h-10 text-amber-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50 pb-20">
            <main className="max-w-2xl mx-auto p-6">
                <header className="flex justify-between items-center mb-6">
                    <h1 className="font-serif text-4xl font-bold text-stone-900">Estante</h1>
                    <Link href="/busca">
                        <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                            <Plus className="w-4 h-4 mr-1" />
                            Adicionar
                        </Button>
                    </Link>
                </header>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="w-full mb-6">
                        <TabsTrigger value="lendo" className="flex-1">Lendo</TabsTrigger>
                        <TabsTrigger value="quero-ler" className="flex-1">Quero Ler</TabsTrigger>
                        <TabsTrigger value="lido" className="flex-1">Lido</TabsTrigger>
                    </TabsList>

                    {(["lendo", "quero-ler", "lido"] as const).map((status) => (
                        <TabsContent key={status} value={status} className="space-y-4">
                            {booksByStatus[status].length > 0 ? (
                                booksByStatus[status].map((book) => (
                                    <div
                                        key={book.id}
                                        onClick={() => setSelectedBook(book)}
                                        className="bg-white rounded-xl shadow-sm border border-stone-200 p-4 flex gap-4 cursor-pointer hover:shadow-md transition-shadow"
                                    >
                                        <div className="w-16 h-24 flex-shrink-0 relative rounded overflow-hidden">
                                            <Image src={toHttps(book.coverUrl)} alt={book.title} fill className="object-cover" />
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <h3 className="font-serif text-lg font-bold text-stone-900 truncate">{book.title}</h3>
                                            <p className="text-sm text-stone-600 truncate">{book.authors.join(", ")}</p>
                                            {book.status === "lendo" && book.progress !== undefined && book.pageCount > 0 && (
                                                <div className="mt-2 space-y-1">
                                                    <div className="flex justify-between text-xs text-stone-600">
                                                        <span>Pág. {book.progress} / {book.pageCount}</span>
                                                        <span>{Math.round((book.progress / book.pageCount) * 100)}%</span>
                                                    </div>
                                                    <Progress value={(book.progress / book.pageCount) * 100} className="h-1.5" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-white rounded-2xl p-12 text-center border border-stone-200">
                                    <BookOpen className="w-16 h-16 text-stone-400 mx-auto mb-4" />
                                    <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">Nenhum livro aqui</h3>
                                    <p className="text-stone-600 mb-4">Adicione livros à sua estante</p>
                                    <Link href="/busca">
                                        <Button className="bg-amber-600 hover:bg-amber-700">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Buscar Livros
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </TabsContent>
                    ))}
                </Tabs>
            </main>

            <BookDetailsModal book={selectedBook} onClose={() => setSelectedBook(null)} onUpdate={loadBooks} />
            <Navbar />
        </div>
    );
}
