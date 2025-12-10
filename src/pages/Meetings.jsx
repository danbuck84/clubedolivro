// Meetings.jsx
// Página de listagem de encontros

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAllMeetings, toggleRSVP, hasUserRSVP, countRSVPs } from '../services/meetingService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Loader2, Calendar, MapPin, Users, Plus, ExternalLink, Edit2 } from 'lucide-react';

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
                                <div
                                    key={meeting.id}
                                    className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden"
                                >
                                    <div className="p-5">
                                        <div className="flex gap-4">
                                            {/* Data Badge */}
                                            <div className="flex flex-col items-center justify-center bg-brand-50 rounded-xl p-3 border border-brand-100 min-w-[70px]">
                                                <span className="text-brand-800 font-bold text-3xl font-serif leading-none">
                                                    {format(meetingDate, 'dd', { locale: ptBR })}
                                                </span>
                                                <span className="text-brand-600 text-xs font-bold uppercase tracking-wider mt-1">
                                                    {format(meetingDate, 'MMM', { locale: ptBR })}
                                                </span>
                                            </div>

                                            {/* Informações */}
                                            <div className="flex-grow">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h3 className="font-serif text-lg font-bold text-stone-900">
                                                        {meeting.bookTitle || 'Encontro do Clube'}
                                                    </h3>
                                                    {activeTab === 'upcoming' && (
                                                        <button
                                                            onClick={() => navigate(`/encontros/editar/${meeting.id}`)}
                                                            className="p-2 rounded-lg text-stone-400 hover:text-brand-600 hover:bg-stone-50 transition-colors flex-shrink-0"
                                                            title="Editar encontro"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="space-y-1 text-sm text-stone-600 mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4" />
                                                        {format(meetingDate, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                                                    </div>
                                                    {meeting.locationLink ? (
                                                        <a
                                                            href={meeting.locationLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 text-stone-600 hover:text-brand-600 transition-colors w-fit"
                                                        >
                                                            <MapPin className="w-4 h-4" />
                                                            <span className="hover:underline decoration-brand-500 underline-offset-2">{meeting.locationName}</span>
                                                            <ExternalLink className="w-3 h-3" />
                                                        </a>
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="w-4 h-4" />
                                                            {meeting.locationName}
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-2">
                                                        <Users className="w-4 h-4" />
                                                        {rsvpCount} {rsvpCount === 1 ? 'confirmação' : 'confirmações'}
                                                    </div>
                                                </div>

                                                {/* Avatares */}
                                                {rsvpCount > 0 && (
                                                    <div className="flex -space-x-2 mb-3">
                                                        {rsvpList.slice(0, 5).map((rsvp, idx) => (
                                                            <div key={idx} className="w-8 h-8 rounded-full border-2 border-white bg-stone-200 overflow-hidden">
                                                                <img src={rsvp.photoURL} alt={rsvp.name} />
                                                            </div>
                                                        ))}
                                                        {rsvpCount > 5 && (
                                                            <div className="w-8 h-8 rounded-full border-2 border-white bg-stone-900 text-white flex items-center justify-center text-xs font-bold">
                                                                +{rsvpCount - 5}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Botão RSVP (apenas para encontros futuros) */}
                                                {activeTab === 'upcoming' && (
                                                    <button
                                                        onClick={() => handleRSVP(meeting.id)}
                                                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${isUserGoing
                                                            ? 'bg-green-50 text-green-700 border-2 border-green-200 hover:bg-green-100'
                                                            : 'bg-brand-50 text-brand-700 border-2 border-brand-200 hover:bg-brand-100'
                                                            }`}
                                                    >
                                                        {isUserGoing ? '✓ Confirmado' : 'Eu vou!'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
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
            </div>
        </div>
    );
}
