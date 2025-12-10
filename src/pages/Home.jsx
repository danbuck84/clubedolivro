// Home.jsx
// Dashboard dinâmica com dados reais do Firestore

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getUserLibrary, updateBookProgress } from '../services/shelfService';
import { getNextMeeting, toggleRSVP, hasUserRSVP, countRSVPs } from '../services/meetingService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BookOpen, Loader2, Calendar, MapPin, Users, Plus, Edit2 } from 'lucide-react';

export default function Home() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [currentBook, setCurrentBook] = useState(null);
    const [showProgressModal, setShowProgressModal] = useState(false);
    const [newProgress, setNewProgress] = useState('');
    const [updatingProgress, setUpdatingProgress] = useState(false);
    const [nextMeeting, setNextMeeting] = useState(null);
    const [loadingMeeting, setLoadingMeeting] = useState(true);

    useEffect(() => {
        async function loadCurrentBook() {
            if (!user) return;

            try {
                const library = await getUserLibrary(user.uid);

                // Encontrar livro com status "Lendo"
                const reading = library.find(book => book.status === 'Lendo');

                if (reading) {
                    setCurrentBook(reading);
                    setNewProgress(reading.progress?.toString() || '0');
                }
            } catch (error) {
                console.error('Erro ao carregar biblioteca:', error);
            } finally {
                setLoading(false);
            }
        }

        loadCurrentBook();
    }, [user]);

    useEffect(() => {
        async function loadMeeting() {
            try {
                const meeting = await getNextMeeting();
                setNextMeeting(meeting);
            } catch (error) {
                console.error('Erro ao carregar encontro:', error);
            } finally {
                setLoadingMeeting(false);
            }
        }

        loadMeeting();
    }, []);

    const handleUpdateProgress = async () => {
        if (!currentBook || !user) return;

        const progress = parseInt(newProgress);

        if (isNaN(progress) || progress < 0) {
            alert('Digite um número válido');
            return;
        }

        if (progress > currentBook.pageCount) {
            alert(`O livro tem apenas ${currentBook.pageCount} páginas`);
            return;
        }

        setUpdatingProgress(true);

        try {
            await updateBookProgress(user.uid, currentBook.id, progress);

            // Atualizar estado local
            setCurrentBook({ ...currentBook, progress });
            setShowProgressModal(false);
        } catch (error) {
            console.error('Erro ao atualizar progresso:', error);
            alert('Erro ao atualizar progresso. Tente novamente.');
        } finally {
            setUpdatingProgress(false);
        }
    };

    const handleRSVP = async () => {
        if (!nextMeeting || !user) return;

        try {
            await toggleRSVP(nextMeeting.id, user.uid, {
                name: user.displayName,
                photoURL: user.photoURL
            });

            // Recarregar encontro
            const updatedMeeting = await getNextMeeting();
            setNextMeeting(updatedMeeting);
        } catch (error) {
            console.error('Erro ao atualizar RSVP:', error);
        }
    };

    const firstName = user?.displayName?.split(' ')[0] || 'Leitor';

    return (
        <div className="min-h-screen bg-stone-50 text-stone-900 font-sans p-6 pb-28">
            {/* Header */}
            <header className="flex items-center justify-between py-2 mb-8">
                <div>
                    <h1 className="font-serif text-3xl font-bold text-stone-900">
                        Bom dia, {firstName}
                    </h1>
                    <p className="text-stone-500 text-sm">Vamos ler um pouco hoje?</p>
                </div>
                <div className="relative">
                    <img
                        src={user?.photoURL || "https://ui-avatars.com/api/?name=User&background=random"}
                        alt="User Avatar"
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-stone-200 p-0.5 bg-white shadow-sm"
                    />
                </div>
            </header>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-10 h-10 text-brand-600 animate-spin" />
                </div>
            ) : currentBook ? (
                <>
                    {/* Seção "Lendo Agora" com dados reais */}
                    <section className="mb-10">
                        <div className="flex justify-between items-baseline mb-4">
                            <h2 className="text-xl font-serif font-bold text-stone-800">Lendo Agora</h2>
                            <button
                                onClick={() => navigate('/estante')}
                                className="text-brand-700 text-sm font-medium hover:underline"
                            >
                                Ver estante
                            </button>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5 flex gap-5 relative overflow-hidden group hover:shadow-md transition-shadow">
                            {/* Efeito de fundo */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-bl-full -mr-10 -mt-10 opacity-50"></div>

                            <img
                                src={currentBook.coverUrl}
                                alt={currentBook.title}
                                className="w-24 h-36 rounded-lg shadow-lg object-cover flex-shrink-0 z-10 rotate-1 group-hover:rotate-0 transition-transform duration-300"
                            />
                            <div className="flex-grow z-10 flex flex-col justify-between py-1">
                                <div>
                                    <h3 className="font-serif text-lg font-bold text-stone-900 leading-tight mb-1">
                                        {currentBook.title}
                                    </h3>
                                    <p className="text-stone-500 text-sm font-medium">
                                        {currentBook.authors.join(', ')}
                                    </p>
                                </div>

                                <div className="mt-4">
                                    <div className="flex justify-between text-xs font-semibold text-stone-600 mb-2">
                                        <span>Página {currentBook.progress || 0}</span>
                                        <span className="text-stone-400">de {currentBook.pageCount}</span>
                                    </div>
                                    <div className="w-full bg-stone-200 rounded-full h-3 mt-2 overflow-hidden">
                                        <div
                                            className="bg-gradient-to-r from-amber-500 to-orange-600 h-full rounded-full transition-all duration-500 ease-out"
                                            style={{ width: `${Math.min(((currentBook.progress || 0) / currentBook.pageCount) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setShowProgressModal(true)}
                                    className="mt-4 w-full py-2 text-xs font-bold uppercase tracking-wide text-brand-700 border border-brand-200 rounded-lg hover:bg-brand-50 transition-colors"
                                >
                                    Atualizar Leitura
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Modal de atualização de progresso */}
                    {showProgressModal && (
                        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => !updatingProgress && setShowProgressModal(false)}>
                            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
                                <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">
                                    Atualizar Progresso
                                </h3>
                                <p className="text-stone-500 text-sm mb-6">
                                    "{currentBook.title}"
                                </p>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-stone-700 mb-2">
                                        Página Atual
                                    </label>
                                    <input
                                        type="number"
                                        value={newProgress}
                                        onChange={(e) => setNewProgress(e.target.value)}
                                        min="0"
                                        max={currentBook.pageCount}
                                        className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:outline-none focus:border-brand-500 text-lg font-semibold text-center"
                                        placeholder="0"
                                        disabled={updatingProgress}
                                    />
                                    <p className="text-xs text-stone-400 mt-2 text-center">
                                        Total: {currentBook.pageCount} páginas
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowProgressModal(false)}
                                        disabled={updatingProgress}
                                        className="flex-1 py-3 px-4 border-2 border-stone-200 text-stone-700 font-medium rounded-xl hover:bg-stone-50 transition-colors disabled:opacity-50"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleUpdateProgress}
                                        disabled={updatingProgress}
                                        className="flex-1 py-3 px-4 bg-brand-700 text-white font-bold rounded-xl hover:bg-brand-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {updatingProgress ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Salvando...
                                            </>
                                        ) : (
                                            'Salvar'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                /* Estante Vazia - Redirecionar para busca */
                <section className="mb-10">
                    <div className="bg-white rounded-2xl shadow-md p-10 text-center border border-stone-200">
                        <div className="flex justify-center mb-6">
                            <div className="bg-amber-50 p-8 rounded-2xl">
                                <BookOpen className="w-20 h-20 text-amber-600" strokeWidth={1.5} />
                            </div>
                        </div>

                        <h2
                            className="text-3xl font-serif font-bold text-stone-900 mb-3"
                            style={{ fontFamily: 'Georgia, serif' }}
                        >
                            Sua estante está vazia
                        </h2>

                        <p className="text-stone-600 text-lg mb-8 max-w-md mx-auto">
                            O que vamos ler este mês? 📚
                        </p>

                        <button
                            onClick={() => navigate('/search')}
                            className="w-full bg-stone-900 text-white px-8 py-4 rounded-xl font-medium hover:bg-stone-800 transition-colors shadow-sm"
                        >
                            Buscar Livros
                        </button>

                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-6">
                            <p className="text-amber-900 text-sm leading-relaxed">
                                <span className="font-semibold">Dica:</span> Use a busca para encontrar seu próximo livro!
                            </p>
                        </div>
                    </div>
                </section>
            )}

            {/* Seção "Próximo Encontro" - Dinâmica */}
            <section>
                <h2 className="text-xl font-serif font-bold text-stone-800 mb-4">Próximo Encontro</h2>

                {loadingMeeting ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-10 text-center">
                        <Loader2 className="w-8 h-8 text-brand-600 animate-spin mx-auto" />
                    </div>
                ) : nextMeeting ? (
                    /* Ticket com Dados Reais */
                    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 relative overflow-hidden">
                        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-stone-50 rounded-full border border-stone-100"></div>
                        <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-stone-50 rounded-full border border-stone-100"></div>
                        <div className="absolute left-4 right-4 top-1/2 border-t-2 border-dashed border-stone-100"></div>

                        <div className="p-5 pb-8">
                            <div className="flex justify-between items-start">
                                <div className="flex flex-col items-center bg-brand-50 rounded-xl p-3 border border-brand-100 min-w-[70px]">
                                    <span className="text-brand-800 font-bold text-3xl font-serif leading-none">
                                        {format(nextMeeting.date.toDate(), 'dd', { locale: ptBR })}
                                    </span>
                                    <span className="text-brand-600 text-xs font-bold uppercase tracking-wider mt-1">
                                        {format(nextMeeting.date.toDate(), 'MMM', { locale: ptBR })}
                                    </span>
                                </div>
                                <div className="ml-4 flex-grow">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="font-serif text-lg font-bold text-stone-900">
                                            {nextMeeting.bookTitle || 'Encontro do Clube'}
                                        </h3>
                                        <button
                                            onClick={() => navigate(`/encontros/editar/${nextMeeting.id}`)}
                                            className="p-1.5 rounded-lg text-stone-400 hover:text-brand-600 hover:bg-stone-50 transition-colors"
                                            title="Editar encontro"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    {nextMeeting.locationLink ? (
                                        <a
                                            href={nextMeeting.locationLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center text-stone-500 hover:text-brand-600 text-sm mt-2 w-fit transition-colors"
                                        >
                                            <MapPin className="w-3.5 h-3.5 mr-1.5" />
                                            <span className="hover:underline decoration-brand-500 underline-offset-2">{nextMeeting.locationName}</span>
                                            <span className="mx-1.5">•</span>
                                            <span>{nextMeeting.time}</span>
                                        </a>
                                    ) : (
                                        <div className="flex items-center text-stone-500 text-sm mt-2">
                                            <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                                            {nextMeeting.locationName} • {nextMeeting.time}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-stone-50/50 p-4 border-t border-stone-100">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-medium text-stone-900">Quem vai:</span>
                                <div className="flex -space-x-3">
                                    {Object.values(nextMeeting.rsvps || {}).slice(0, 3).map((rsvp, idx) => (
                                        <div key={idx} className="w-8 h-8 rounded-full border-2 border-white bg-stone-200 overflow-hidden">
                                            <img src={rsvp.photoURL} alt={rsvp.name} />
                                        </div>
                                    ))}
                                    {countRSVPs(nextMeeting) > 3 && (
                                        <div className="w-8 h-8 rounded-full border-2 border-white bg-stone-900 text-white flex items-center justify-center text-xs font-bold">
                                            +{countRSVPs(nextMeeting) - 3}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={handleRSVP}
                                className={`w-full mt-4 py-3 rounded-xl font-bold shadow-sm transition-colors ${hasUserRSVP(nextMeeting, user?.uid)
                                    ? 'bg-green-50 text-green-700 border-2 border-green-200 hover:bg-green-100'
                                    : 'bg-brand-600 text-white hover:bg-brand-700'
                                    }`}
                            >
                                {hasUserRSVP(nextMeeting, user?.uid) ? '✓ Confirmado' : 'Eu vou!'}
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Empty State - Sem encontro marcado */
                    <div className="bg-white rounded-2xl shadow-md p-8 text-center border border-stone-200">
                        <div className="flex justify-center mb-4">
                            <div className="bg-amber-50 p-6 rounded-2xl">
                                <Calendar className="w-16 h-16 text-amber-600" strokeWidth={1.5} />
                            </div>
                        </div>

                        <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2">
                            Nenhum encontro marcado
                        </h3>

                        <p className="text-stone-600 mb-6">
                            Que tal agendar o próximo encontro do clube?
                        </p>

                        <button
                            onClick={() => navigate('/agendar')}
                            className="bg-brand-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-brand-800 transition-colors shadow-sm inline-flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Agendar Encontro
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
}
