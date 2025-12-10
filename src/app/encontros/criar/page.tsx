"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createMeeting } from "@/services/meetingService";
import { formatForInput, parseInputDate } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function CreateMeetingPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        bookTitle: "",
        date: "",
        time: "",
        locationName: "",
        locationLink: "",
    });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!formData.bookTitle || !formData.date || !formData.time || !formData.locationName) {
            toast.error("Preencha todos os campos obrigatórios");
            return;
        }

        setLoading(true);
        try {
            await createMeeting({
                bookTitle: formData.bookTitle,
                date: parseInputDate(formData.date),
                time: formData.time,
                locationName: formData.locationName,
                locationLink: formData.locationLink || undefined,
            });

            toast.success("Encontro criado com sucesso!");
            router.push("/encontros");
        } catch (error) {
            console.error(error);
            toast.error("Erro ao criar encontro");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-stone-50 pb-20">
            <main className="max-w-2xl mx-auto p-6">
                <header className="mb-6">
                    <h1 className="font-serif text-4xl font-bold text-stone-900">Novo Encontro</h1>
                </header>

                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                            Título do Livro *
                        </label>
                        <Input
                            value={formData.bookTitle}
                            onChange={(e) => setFormData({ ...formData, bookTitle: e.target.value })}
                            placeholder="Ex: 1984"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                            Data e Hora *
                        </label>
                        <Input
                            type="datetime-local"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                            Horário *
                        </label>
                        <Input
                            value={formData.time}
                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            placeholder="Ex: 19:00h"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                            Local *
                        </label>
                        <Input
                            value={formData.locationName}
                            onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                            placeholder="Ex: Cafeteria Central"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                            Link do Local (Google Maps)
                        </label>
                        <Input
                            type="url"
                            value={formData.locationLink}
                            onChange={(e) => setFormData({ ...formData, locationLink: e.target.value })}
                            placeholder="https://maps.google.com/..."
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading} className="flex-1 bg-amber-600 hover:bg-amber-700">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Criar Encontro
                        </Button>
                    </div>
                </form>
            </main>
            <Navbar />
        </div>
    );
}
