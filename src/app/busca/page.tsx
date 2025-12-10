"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { searchBooks, FormattedBook } from "@/services/googleBooks";
import { addBookToShelf } from "@/services/shelfService";
import { Loader2, Search as SearchIcon } from "lucide-react";
import Image from "next/image";
import { toHttps } from "@/lib/utils";
import { toast } from "sonner";

export default function SearchPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState<FormattedBook[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedBook, setSelectedBook] = useState<FormattedBook | null>(null);
    const [adding, setAdding] = useState(false);

    async function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        setLoading(true);
        try {
            const books = await searchBooks(searchTerm);
            setResults(books);
        } catch (error) {
            console.error(error);
            toast.error("Erro ao buscar livros");
        } finally {
            setLoading(false);
        }
    }

    async function handleAddBook(status: "quero-ler" | "lendo" | "lido") {
        if (!user || !selectedBook) return;

        setAdding(true);
        try {
            await addBookToShelf(user.uid, selectedBook, status);
            toast.success("Livro adicionado!");
            setSelectedBook(null);
            router.push("/estante");
        } catch (error) {
            console.error(error);
            toast.error("Erro ao adicionar livro");
        } finally {
            setAdding(false);
        }
    }

    return (
        <div className="min-h-screen bg-stone-50 pb-20">
            <main className="max-w-2xl mx-auto p-6">
                <header className="mb-6">
                    <h1 className="font-serif text-4xl font-bold text-stone-900 mb-4">Buscar Livros</h1>
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <Input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Digite o título ou autor..."
                            className="flex-grow"
                        />
                        <Button type="submit" disabled={loading} className="bg-amber-600 hover:bg-amber-700">
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <SearchIcon className="w-5 h-5" />}
                        </Button>
                    </form>
                </header>

                <div className="grid grid-cols-2 gap-4">
                    {results.map((book) => (
                        <div
                            key={book.googleId}
                            onClick={() => setSelectedBook(book)}
                            className="bg-white rounded-xl shadow-sm border border-stone-200 p-3 cursor-pointer hover:shadow-md transition-shadow"
                        >
                            <div className="w-full aspect-[2/3] relative rounded overflow-hidden mb-2">
                                <Image src={toHttps(book.coverUrl)} alt={book.title} fill className="object-cover" />
                            </div>
                            <h3 className="font-serif text-sm font-bold text-stone-900 line-clamp-2 mb-1">{book.title}</h3>
                            <p className="text-xs text-stone-600 truncate">{book.authors.join(", ")}</p>
                        </div>
                    ))}
                </div>

                {results.length === 0 && !loading && searchTerm && (
                    <div className="text-center py-12 text-stone-600">Nenhum resultado encontrado</div>
                )}
            </main>

            <Dialog open={!!selectedBook} onOpenChange={() => setSelectedBook(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="font-serif">Adicionar à Estante</DialogTitle>
                    </DialogHeader>
                    {selectedBook && (
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <div className="w-20 h-30 relative rounded overflow-hidden flex-shrink-0">
                                    <Image src={toHttps(selectedBook.coverUrl)} alt={selectedBook.title} fill className="object-cover" />
                                </div>
                                <div className="flex-grow min-w-0">
                                    <h3 className="font-serif font-bold text-stone-900 text-sm line-clamp-2">{selectedBook.title}</h3>
                                    <p className="text-xs text-stone-600">{selectedBook.authors.join(", ")}</p>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-2">Selecione o status:</label>
                                <div className="flex flex-col gap-2">
                                    {[
                                        { value: "quero-ler", label: "Quero Ler" },
                                        { value: "lendo", label: "Lendo Agora" },
                                        { value: "lido", label: "Já Li" },
                                    ].map((status) => (
                                        <Button
                                            key={status.value}
                                            onClick={() => handleAddBook(status.value as any)}
                                            disabled={adding}
                                            variant="outline"
                                            className="justify-start"
                                        >
                                            {status.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Navbar />
        </div>
    );
}
