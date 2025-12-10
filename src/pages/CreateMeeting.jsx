// CreateMeeting.jsx
// Página de agendamento de encontros

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createMeeting } from '../services/meetingService';
import { Timestamp } from 'firebase/firestore';
import { Calendar, MapPin, Link as LinkIcon, BookOpen, Loader2 } from 'lucide-react';

export default function CreateMeeting() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        datetime: '',
        locationName: '',
        locationLink: '',
        bookTitle: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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

        setLoading(true);

        try {
            // Separar data e hora
            const dateObj = new Date(formData.datetime);
            const date = Timestamp.fromDate(dateObj);
            const time = dateObj.toTimeString().substring(0, 5); // HH:mm

            await createMeeting({
                date,
                time,
                locationName: formData.locationName.trim(),
                locationLink: formData.locationLink.trim(),
                bookTitle: formData.bookTitle.trim(),
                createdBy: user.uid
            });

            // Redirecionar para home
            navigate('/');
        } catch (err) {
            console.error('Erro ao criar encontro:', err);
            setError('Erro ao criar encontro. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen bg-stone-50 text-stone-900 font-sans p-6 pb-28">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <header className="mb-8">
                    <h1 className="font-serif text-4xl font-bold text-stone-900 mb-2 text-center">
                        Agendar Encontro
                    </h1>
                    <p className="text-stone-500 text-center">
                        Organize o próximo encontro do clube
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
                            disabled={loading}
                            className="flex-1 py-3 px-4 border-2 border-stone-200 text-stone-700 font-medium rounded-xl hover:bg-stone-50 transition-colors disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 px-4 bg-brand-700 text-white font-bold rounded-xl hover:bg-brand-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Agendando...
                                </>
                            ) : (
                                'Agendar Encontro'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
