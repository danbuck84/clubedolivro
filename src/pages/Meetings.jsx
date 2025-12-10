// Meetings.jsx
// Página de listagem de encontros

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAllMeetings, toggleRSVP, hasUserRSVP, countRSVPs } from '../services/meetingService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Loader2, Calendar, MapPin, Users, Plus, ExternalLink, Edit2, Clock } from 'lucide-react';

export default function Meetings() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming');

    useEffect(() => {
        loadMeetings();
    }, []);

    const loadMeetings = async () => {
        setLoading(true);
        try {
            const allMeetings = await getAllMeetings();
            setMeetings(allMeetings);
        } catch (error) {
            console.error('Erro ao carregar encontros:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRSVP = async (meetingId) => {
        if (!user) return;

        try {
            await toggleRSVP(meetingId, user.uid, {
                name: user.displayName,
                photoURL: user.photoURL
            });

            // Recarregar lista
            loadMeetings();
        } catch (error) {
            console.error('Erro ao atualizar RSVP:', error);
        }
    };

    const now = new Date();
    const upcomingMeetings = meetings.filter(m => m.date?.toDate() >= now);
    const pastMeetings = meetings.filter(m => m.date?.toDate() < now);

    const displayMeetings = activeTab === 'upcoming' ? upcomingMeetings : pastMeetings;

    return (
        <div className="min-h-screen bg-stone-50 text-stone-900 font-sans p-6 pb-28">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <header className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="font-serif text-4xl font-bold text-stone-900">
                            Encontros
                        </h1>
                        <button
                            onClick={() => navigate('/agendar')}
                            className="flex items-center gap-2 bg-brand-700 text-white px-4 py-2 rounded-lg hover:bg-brand-800 transition-colors font-medium text-sm"
                        >
                            <Plus className="w-4 h-4" />
                            Agendar
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 border-b-2 border-stone-200">
                        <button
                            onClick={() => setActiveTab('upcoming')}
                            className={`flex-1 py-3 px-4 font-medium transition-all relative ${activeTab === 'upcoming'
                                ? 'text-brand-700 border-b-2 border-brand-600 -mb-0.5'
                                : 'text-stone-500 hover:text-stone-700'
                                }`}
                        >
                            📅 Próximos ({upcomingMeetings.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('past')}
                            className={`flex-1 py-3 px-4 font-medium transition-all relative ${activeTab === 'past'
                                ? 'text-brand-700 border-b-2 border-brand-600 -mb-0.5'
                                : 'text-stone-500 hover:text-stone-700'
                                }`}
                        >
                            📚 Passados ({pastMeetings.length})
                        </button>
                    </div>
                </header>

                {/* Loading */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-10 h-10 text-brand-600 animate-spin" />
                    </div>
                ) : displayMeetings.length > 0 ? (
                    /* Lista de Encontros */
                    <div className="space-y-4">
                        {displayMeetings.map((meeting) => {
                            const meetingDate = meeting.date?.toDate();
                            const isUserGoing = hasUserRSVP(meeting, user?.uid);
                            const rsvpCount = countRSVPs(meeting);
                            const rsvpList = Object.values(meeting.rsvps || {});

                            return (
                                <div key={meeting.id} className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden flex h-full hover:shadow-md transition-shadow">
                                    {/* 1. Barra Lateral de Data */}
                                    <div className="bg-brand-50/80 p-4 flex flex-col justify-center items-center min-w-[85px] border-r border-brand-100/50">
                                        <span className="text-4xl font-serif font-bold text-brand-800 leading-none">
                                            {format(meetingDate, 'd', { locale: ptBR })}
                                        </span>
                                        <span className="text-xs uppercase font-bold text-brand-600 tracking-widest mt-1">
                                            {format(meetingDate, 'MMM', { locale: ptBR }).replace('.', '')}
                                        </span>
                                    </div>

                                    {/* 2. Área de Conteúdo */}
                                    <div className="flex-grow p-5 flex flex-col justify-between relative">
                                        {/* Botão de Editar */}
                                        {activeTab === 'upcoming' && (
                                            <button
                                                onClick={() => navigate(`/encontros/editar/${meeting.id}`)}
                                                className="absolute top-3 right-3 text-stone-400 hover:text-brand-600 p-1.5 rounded-lg hover:bg-stone-50 transition-all"
                                                title="Editar encontro"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                        )}

                                        {/* Título e Detalhes */}
                                        <div>
                                            <h3 className="font-serif text-xl font-bold text-stone-900 leading-tight pr-10 mb-3">
                                                {meeting.bookTitle ? `Encontro: "${meeting.bookTitle}"` : 'Encontro do Clube'}
                                            </h3>

                                            <div className="flex flex-wrap items-center gap-4 text-sm text-stone-500 font-medium">
                                                {/* Horário */}
                                                <div className="flex items-center">
                                                    <Clock size={14} className="mr-1.5 text-brand-500" />
                                                    {format(meetingDate, 'HH:mm', { locale: ptBR })}h
                                                </div>
                                                {/* Local com Link */}
                                                {meeting.locationLink ? (
                                                    <a
                                                        href={meeting.locationLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center hover:text-brand-700 group"
                                                    >
                                                        <MapPin size={14} className="mr-1.5 text-brand-500 group-hover:text-brand-700" />
                                                        <span className="underline decoration-dotted decoration-stone-300 underline-offset-2 group-hover:decoration-brand-500">
                                                            {meeting.locationName}
                                                        </span>
                                                    </a>
                                                ) : (
                                                    <div className="flex items-center">
                                                        <MapPin size={14} className="mr-1.5 text-brand-500" />
                                                        {meeting.locationName}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Rodapé do Card (Avatares e RSVP) */}
                                        <div className="flex justify-between items-end mt-5 pt-4 border-t border-stone-100">
                                            {/* Stack de Avatares (Quem vai) */}
                                            <div className="flex -space-x-2">
                                                {rsvpCount > 0 ? (
                                                    <>
                                                        {rsvpList.slice(0, 3).map((rsvp, idx) => (
                                                            <div key={idx} className="w-8 h-8 rounded-full border-2 border-white bg-stone-200 overflow-hidden ring-1 ring-stone-100">
                                                                <img src={rsvp.photoURL} alt={rsvp.name} className="w-full h-full object-cover" />
                                                            </div>
                                                        ))}
                                                        {rsvpCount > 3 && (
                                                            <div className="w-8 h-8 rounded-full border-2 border-white bg-stone-900 text-white flex items-center justify-center text-xs font-bold ring-1 ring-stone-100">
                                                                +{rsvpCount - 3}
                                                            </div>
                                                        )}
                                                    </>
                                                ) : (
                                                    <span className="text-xs text-stone-400 italic">Nenhuma confirmação</span>
                                                )}
                                            </div>

                                            {/* Botão/Badge RSVP */}
                                            {activeTab === 'upcoming' && (
                                                <button
                                                    onClick={() => handleRSVP(meeting.id)}
                                                    className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all ${isUserGoing
                                                        ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                                                        : 'bg-brand-50 text-brand-700 border border-brand-200 hover:bg-brand-100'
                                                        }`}
                                                >
                                                    {isUserGoing ? '✓ Confirmado' : 'Confirmar'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div >
                ) : (
                    /* Empty State */
                    <div className="bg-white rounded-2xl shadow-md p-10 text-center border border-stone-200">
                        <div className="flex justify-center mb-6">
                            <div className="bg-amber-50 p-8 rounded-2xl">
                                <Calendar className="w-20 h-20 text-amber-600" strokeWidth={1.5} />
                            </div>
                        </div>

                        <h2 className="text-3xl font-serif font-bold text-stone-900 mb-3">
                            {activeTab === 'upcoming' ? 'Nenhum encontro marcado' : 'Sem histórico ainda'}
                        </h2>

                        <p className="text-stone-600 text-lg mb-8 max-w-md mx-auto">
                            {activeTab === 'upcoming'
                                ? 'Que tal agendar o próximo encontro do clube?'
                                : 'Os encontros realizados aparecerão aqui'
                            }
                        </p>

                        {activeTab === 'upcoming' && (
                            <button
                                onClick={() => navigate('/agendar')}
                                className="bg-stone-900 text-white px-8 py-4 rounded-xl font-medium hover:bg-stone-800 transition-colors shadow-sm"
                            >
                                Agendar Encontro
                            </button>
                        )}
                    </div>
                )}
            </div >
        </div >
    );
}
