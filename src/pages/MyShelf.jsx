// MyShelf.jsx
// Página Minha Estante com tabs por status

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getUserLibrary } from '../services/shelfService';
import { Loader2, BookOpen, Eye } from 'lucide-react';
import BookDetailsModal from '../components/BookDetailsModal';

export default function MyShelf() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Lendo');
    const [library, setLibrary] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBook, setSelectedBook] = useState(null);

    const tabs = [
        { value: 'Lendo', label: 'Lendo', emoji: '📖' },
        { value: 'Quero Ler', label: 'Quero Ler', emoji: '📚' },
        { value: 'Lido', label: 'Lidos', emoji: '✓' },
    ];

    const loadLibrary = async () => {
        if (!user) return;

        setLoading(true);
        try {
            const books = await getUserLibrary(user.uid);
            setLibrary(books);
        } catch (error) {
            console.error('Erro ao carregar biblioteca:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLibrary();
    }, [user]);

    // Filtrar livros por status ativo
    const filteredBooks = library.filter(book => book.status === activeTab);

    return (
        <div className="min-h-screen bg-stone-50 text-stone-900 font-sans p-6 pb-28">
            {/* Header */}
            <header className="max-w-6xl mx-auto mb-8">
                <h1 className="font-serif text-4xl font-bold text-stone-900 mb-6 text-center">
                    Minha Estante
                </h1>

                {/* Tabs */}
                <div className="flex gap-2 border-b-2 border-stone-200">
                    {tabs.map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => setActiveTab(tab.value)}
                            className={`flex-1 py-3 px-4 font-medium transition-all relative ${activeTab === tab.value
                                ? 'text-brand-700 border-b-2 border-brand-600 -mb-0.5'
                                : 'text-stone-500 hover:text-stone-700'
                                }`}
                        >
                            <span className="mr-2">{tab.emoji}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </header>

            {/* Loading */}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-10 h-10 text-brand-600 animate-spin" />
                </div>
            ) : filteredBooks.length > 0 ? (
                /* Lista de Livros */
                <div className="max-w-6xl mx-auto">
                    <p className="text-stone-500 text-sm mb-6 text-center">
                        {filteredBooks.length} {filteredBooks.length === 1 ? 'livro' : 'livros'}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredBooks.map((book) => (
                            <div
                                key={book.id}
                                className="bg-white rounded-2xl shadow-sm border border-stone-100 p-4 hover:shadow-md transition-shadow group h-full flex flex-col"
                            >
                                <div className="aspect-[2/3] mb-3 overflow-hidden rounded-lg bg-stone-100 relative">
                                    <img
                                        src={book.coverUrl}
                                        alt={book.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    {/* Badge de progresso para livros "Lendo" */}
                                    {book.status === 'Lendo' && book.pageCount > 0 && (
                                        <div className="absolute bottom-2 left-2 bg-brand-700 text-white text-xs font-bold px-2 py-1 rounded-full">
                                            {Math.round((book.progress / book.pageCount) * 100)}%
                                        </div>
                                    )}
                                </div>

                                <h3 className="font-serif font-bold text-sm text-stone-900 leading-tight mb-1 line-clamp-2">
                                    {book.title}
                                </h3>

                                <p className="text-xs text-stone-500 mb-3 line-clamp-1">
                                    {book.authors.join(', ')}
                                </p>

                                {/* Progress info para livros "Lendo" */}
                                {book.status === 'Lendo' && (
                                    <div className="mb-3 text-xs text-stone-600">
                                        <div className="flex justify-between mb-1">
                                            <span>Pág. {book.progress || 0}</span>
                                            <span className="text-stone-400">de {book.pageCount}</span>
                                        </div>
                                        <div className="w-full bg-stone-100 rounded-full h-1.5">
                                            <div
                                                className="bg-gradient-to-r from-brand-400 to-brand-600 h-1.5 rounded-full transition-all"
                                                style={{ width: `${Math.min((book.progress / book.pageCount) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={() => setSelectedBook(book)}
                                    className="w-full flex items-center justify-center gap-2 bg-stone-50 text-stone-700 font-medium text-sm py-2 px-3 rounded-lg hover:bg-stone-100 transition-colors border border-stone-200 mt-auto"
                                >
                                    <Eye className="w-4 h-4" />
                                    Ver Detalhes
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                /* Empty State */
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-md p-10 text-center border border-stone-200">
                        <div className="flex justify-center mb-6">
                            <div className="bg-amber-50 p-8 rounded-2xl">
                                <BookOpen className="w-20 h-20 text-amber-600" strokeWidth={1.5} />
                            </div>
                        </div>

                        <h2 className="text-3xl font-serif font-bold text-stone-900 mb-3">
                            Nenhum livro aqui ainda
                        </h2>

                        <p className="text-stone-600 text-lg mb-8 max-w-md mx-auto">
                            {activeTab === 'Lendo' && 'Comece a ler algo novo! 📖'}
                            {activeTab === 'Quero Ler' && 'Adicione livros à sua lista de desejos 📚'}
                            {activeTab === 'Lido' && 'Complete sua primeira leitura! ✓'}
                        </p>

                        <button
                            onClick={() => navigate('/search')}
                            className="w-full bg-stone-900 text-white px-8 py-4 rounded-xl font-medium hover:bg-stone-800 transition-colors shadow-sm"
                        >
                            Buscar Novos Livros
                        </button>
                    </div>
                </div>
            )}

            {/* Modal de Detalhes */}
            {selectedBook && (
                <BookDetailsModal
                    book={selectedBook}
                    onClose={() => setSelectedBook(null)}
                    onUpdate={loadLibrary}
                />
            )}
        </div>
    );
}
