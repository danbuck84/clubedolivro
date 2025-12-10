"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Loader2, Trash2 } from "lucide-react";
import { Book, updateBookProgress, updateBookStatus, removeBook } from "@/services/shelfService";
import { toHttps } from "@/lib/utils";
import { toast } from "sonner";
import Image from "next/image";

interface BookDetailsModalProps {
    book: Book | null;
    onClose: () => void;
    onUpdate: () => void;
}

export function BookDetailsModal({
    book,
    onClose,
    onUpdate,
}: BookDetailsModalProps) {
    const [progress, setProgress] = useState(book?.progress || 0);
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);

    if (!book) return null;

    const handleStatusChange = async (newStatus: "quero-ler" | "lendo" | "lido") => {
        setLoading(true);
        try {
            await updateBookStatus(book.id, newStatus);
            toast.success("Status atualizado!");
            onUpdate();
            onClose();
        } catch (error) {
            toast.error("Erro ao atualizar status");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleProgressUpdate = async () => {
        if (book.status !== "lendo") return;

        setLoading(true);
        try {
            await updateBookProgress(book.id, progress);
            toast.success("Progresso atualizado!");
            onUpdate();
        } catch (error) {
            toast.error("Erro ao atualizar progresso");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Tem certeza que deseja remover este livro?")) return;

        setDeleting(true);
        try {
            await removeBook(book.id);
            toast.success("Livro removido!");
            onUpdate();
            onClose();
        } catch (error) {
            toast.error("Erro ao remover livro");
            console.error(error);
        } finally {
            setDeleting(false);
        }
    };

    const progressPercent = book.pageCount > 0
        ? Math.round((progress / book.pageCount) * 100)
        : 0;

    return (
        <Dialog open={!!book} onOpenChange={onClose}>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="font-serif text-2xl">
                        Detalhes do Livro
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Book Info */}
                    <div className="flex gap-4">
                        <div className="w-24 h-36 flex-shrink-0 relative rounded-lg overflow-hidden border border-stone-200">
                            <Image
                                src={toHttps(book.coverUrl)}
                                alt={book.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex-grow min-w-0">
                            <h3 className="font-serif text-lg font-bold text-stone-900 leading-tight mb-1">
                                {book.title}
                            </h3>
                            <p className="text-sm text-stone-600 mb-2">
                                {book.authors.join(", ")}
                            </p>
                            <div className="flex gap-3 text-xs text-stone-500">
                                {book.pageCount > 0 && <span>📄 {book.pageCount}p</span>}
                                {book.publishedDate && (
                                    <span>📅 {book.publishedDate.substring(0, 4)}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Status Selection */}
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                            Status
                        </label>
                        <div className="flex gap-2">
                            {[
                                { value: "quero-ler", label: "Quero Ler" },
                                { value: "lendo", label: "Lendo" },
                                { value: "lido", label: "Lido" },
                            ].map((status) => (
                                <Button
                                    key={status.value}
                                    variant={book.status === status.value ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handleStatusChange(status.value as any)}
                                    disabled={loading}
                                    className={
                                        book.status === status.value
                                            ? "bg-amber-600 hover:bg-amber-700"
                                            : ""
                                    }
                                >
                                    {status.label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Progress (only for "Lendo") */}
                    {book.status === "lendo" && (
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-2">
                                Progresso de Leitura
                            </label>
                            <div className="flex gap-2 items-center mb-2">
                                <span className="text-xs text-stone-600">Pág.</span>
                                <Input
                                    type="number"
                                    value={progress}
                                    onChange={(e) => setProgress(Number(e.target.value))}
                                    min="0"
                                    max={book.pageCount}
                                    disabled={loading}
                                    className="w-20"
                                />
                                <span className="text-xs text-stone-600">/ {book.pageCount}</span>
                                <Button
                                    onClick={handleProgressUpdate}
                                    disabled={loading || progress === book.progress}
                                    size="sm"
                                    className="ml-auto bg-amber-600 hover:bg-amber-700"
                                >
                                    {loading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        "Salvar"
                                    )}
                                </Button>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-stone-600">
                                    <span>{progressPercent}% concluído</span>
                                </div>
                                <Progress value={progressPercent} className="h-2" />
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex justify-between">
                    <Button
                        variant="ghost"
                        onClick={handleDelete}
                        disabled={deleting || loading}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                        {deleting ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                            <Trash2 className="w-4 h-4 mr-2" />
                        )}
                        Remover
                    </Button>
                    <Button variant="outline" onClick={onClose}>
                        Fechar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
