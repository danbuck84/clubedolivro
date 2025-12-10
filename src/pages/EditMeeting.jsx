// EditMeeting.jsx
// Página de edição de encontros

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getMeetingById, updateMeeting } from '../services/meetingService';
import { Timestamp } from 'firebase/firestore';
import { Calendar, MapPin, Link as LinkIcon, BookOpen, Loader2 } from 'lucide-react';

export default function EditMeeting() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        datetime: '',
        locationName: '',
        locationLink: '',
        bookTitle: ''
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        async function loadMeeting() {
            try {
                const meeting = await getMeetingById(id);

                // Converter Timestamp para datetime-local
                const date = meeting.date.toDate();
                const datetime = date.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm

                setFormData({
                    datetime,
                    locationName: meeting.locationName || '',
                    locationLink: meeting.locationLink || '',
                    bookTitle: meeting.bookTitle || ''
                });
            } catch (err) {
                console.error('Erro ao carregar encontro:', err);
                setError('Erro ao carregar encontro');
            } finally {
                setLoading(false);
            }
        }

        loadMeeting();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validações
        if (!formData.datetime) {
            setError('Selecione uma data e hora');
            return;
        }

        if (!formData.locationName.trim()) {
            setError('Digite o nome do local');
            return;
        }

        if (!formData.bookTitle.trim()) {
            setError('Digite o título do livro');
            return;
        }

        // Verificar se data não é no passado
        const selectedDate = new Date(formData.datetime);
        if (selectedDate < new Date()) {
            setError('A data não pode ser no passado');
            return;
        }

        setSaving(true);

        try {
            // Separar data e hora
            const dateObj = new Date(formData.datetime);
            const date = Timestamp.fromDate(dateObj);
            const time = dateObj.toTimeString().substring(0, 5); // HH:mm

            await updateMeeting(id, {
                date,
                time,
                locationName: formData.locationName.trim(),
                locationLink: formData.locationLink.trim(),
                bookTitle: formData.bookTitle.trim()
            });

            // Redirecionar para encontros
            navigate('/encontros');
        } catch (err) {
            console.error('Erro ao atualizar encontro:', err);
            setError('Erro ao atualizar encontro. Tente novamente.');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-stone-50 text-stone-900 font-sans p-6 pb-28 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-brand-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50 text-stone-900 font-sans p-6 pb-28">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <header className="mb-8">
                    <h1 className="font-serif text-4xl font-bold text-stone-900 mb-2 text-center">
                        Editar Encontro
                    </h1>
                    <p className="text-stone-500 text-center">
                        Atualize as informações do encontro
                    </p>
                </header>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
                    {/* Data e Hora */}
                    <div className="mb-6">
                        <label className="flex items-center gap-2 text-sm font-medium text-stone-700 mb-2">
                            <Calendar className="w-4 h-4" />
                            Data e Hora
                        </label>
                        <input
                            type="datetime-local"
                            name="datetime"
                            value={formData.datetime}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:outline-none focus:border-brand-500 transition-colors"
                        />
                    </div>

                    {/* Local */}
                    <div className="mb-6">
                        <label className="flex items-center gap-2 text-sm font-medium text-stone-700 mb-2">
                            <MapPin className="w-4 h-4" />
                            Local
                        </label>
                        <input
                            type="text"
                            name="locationName"
                            value={formData.locationName}
                            onChange={handleChange}
                            placeholder="Ex: Cafeteria Central"
                            required
                            className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:outline-none focus:border-brand-500 transition-colors"
                        />
                    </div>

                    {/* Link Google Maps */}
                    <div className="mb-6">
                        <label className="flex items-center gap-2 text-sm font-medium text-stone-700 mb-2">
                            <LinkIcon className="w-4 h-4" />
                            Link do Google Maps (opcional)
                        </label>
                        <input
                            type="url"
                            name="locationLink"
                            value={formData.locationLink}
                            onChange={handleChange}
                            placeholder="https://maps.google.com/..."
                            className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:outline-none focus:border-brand-500 transition-colors"
                        />
                    </div>

                    {/* Livro do Mês */}
                    <div className="mb-6">
                        <label className="flex items-center gap-2 text-sm font-medium text-stone-700 mb-2">
                            <BookOpen className="w-4 h-4" />
                            Livro do Mês
                        </label>
                        <input
                            type="text"
                            name="bookTitle"
                            value={formData.bookTitle}
                            onChange={handleChange}
                            placeholder="Ex: O Conto da Aia"
                            required
                            className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:outline-none focus:border-brand-500 transition-colors"
                        />
                    </div>

                    {/* Mensagem de erro */}
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Botões */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            disabled={saving}
                            className="flex-1 py-3 px-4 border-2 border-stone-200 text-stone-700 font-medium rounded-xl hover:bg-stone-50 transition-colors disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 py-3 px-6 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-50 shadow-md flex items-center justify-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Salvando...
                                </>
                            ) : (
                                'Salvar Alterações'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
