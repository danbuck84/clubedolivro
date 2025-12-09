// Search.jsx
// Página de busca de livros

import React, { useState } from 'react';
import { Search as SearchIcon, Plus, Check, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { searchBooks } from '../services/googleBooks';
import { addBookToShelf } from '../services/shelfService';

export default function Search() {
    const { user } = useAuth();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedBook, setSelectedBook] = useState(null);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [addingBook, setAddingBook] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!query.trim()) {
            return;
        }

        setLoading(true);
        setError('');
        setResults([]);

        try {
            const books = await searchBooks(query);
            setResults(books);

            if (books.length === 0) {
                setError('Nenhum livro encontrado. Tente outro termo.');
            }
        } catch (err) {
            setError('Erro ao buscar livros. Tente novamente.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddClick = (book) => {
        setSelectedBook(book);
        setShowStatusModal(true);
    };

    const handleAddToShelf = async (status) => {
        if (!selectedBook || !user) return;

        setAddingBook(true);

        try {
            await addBookToShelf(user.uid, selectedBook, status);

            // Mostrar toast de sucesso
            setSuccessMessage(`✓ "${selectedBook.title}" adicionado à estante!`);
            setTimeout(() => setSuccessMessage(''), 3000);

            setShowStatusModal(false);
            setSelectedBook(null);
        } catch (error) {
            console.error('Erro ao adicionar livro:', error);
            setError('Erro ao adicionar livro. Tente novamente.');
        } finally {
            setAddingBook(false);
        }
    };

    const statusOptions = [
        { value: 'Lendo', label: 'Lendo', emoji: '📖' },
        { value: 'Quero Ler', label: 'Quero Ler', emoji: '📚' },
        { value: 'Lido', label: 'Lido', emoji: '✓' },
    ];

    return (
        <div className="min-h-screen bg-stone-50 text-stone-900 font-sans p-6 pb-28">
            {/* Header com busca */}
            <header className="max-w-4xl mx-auto mb-12">
                <h1 className="font-serif text-4xl font-bold text-stone-900 mb-8 text-center">
                    Buscar Livros
                </h1>

                <form onSubmit={handleSearch} className="relative">
                    <div className="relative">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-stone-400" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Qual a próxima leitura?"
                            className="w-full pl-14 pr-6 py-4 text-lg bg-white border-2 border-stone-200 rounded-2xl focus:outline-none focus:border-brand-500 transition-colors shadow-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !query.trim()}
                        className="mt-4 w-full bg-brand-700 text-white font-bold py-4 px-6 rounded-xl hover:bg-brand-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                        {loading ? 'Buscando...' : 'Buscar'}
                    </button>
                </form>
            </header>

            {/* Mensagem de erro */}
            {error && (
                <div className="max-w-4xl mx-auto mb-6">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-center">
                        {error}
                    </div>
                </div>
            )}

            {/* Toast de sucesso */}
            {successMessage && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-full shadow-xl animate-fade-in">
                    {successMessage}
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-10 h-10 text-brand-600 animate-spin" />
                </div>
            )}

            {/* Resultados */}
            {!loading && results.length > 0 && (
                <div className="max-w-6xl mx-auto">
                    <p className="text-stone-500 text-sm mb-6 text-center">
                        {results.length} {results.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {results.map((book) => (
                            <div
                                key={book.id}
                                className="bg-white rounded-2xl shadow-sm border border-stone-100 p-4 hover:shadow-md transition-shadow group h-full flex flex-col"
                            >
                                <div className="aspect-[2/3] mb-3 overflow-hidden rounded-lg bg-stone-100">
                                    <img
                                        src={book.coverUrl}
                                        alt={book.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>

                                <h3 className="font-serif font-bold text-sm text-stone-900 leading-tight mb-1 line-clamp-2">
                                    {book.title}
                                </h3>

                                <p className="text-xs text-stone-500 mb-3 line-clamp-1">
                                    {book.authors.join(', ')}
                                </p>

                                <button
                                    onClick={() => handleAddClick(book)}
                                    className="w-full flex items-center justify-center gap-2 bg-brand-50 text-brand-700 font-medium text-sm py-2 px-3 rounded-lg hover:bg-brand-100 transition-colors border border-brand-200 mt-auto"
                                >
                                    <Plus className="w-4 h-4" />
                                    Adicionar
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Modal de seleção de status */}
            {showStatusModal && selectedBook && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => !addingBook && setShowStatusModal(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
                        <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">
                            Adicionar à Estante
                        </h3>
                        <p className="text-stone-500 text-sm mb-6">
                            "{selectedBook.title}"
                        </p>

                        <div className="space-y-3">
                            {statusOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => handleAddToShelf(option.value)}
                                    disabled={addingBook}
                                    className="w-full flex items-center gap-3 bg-stone-50 hover:bg-brand-50 border-2 border-stone-200 hover:border-brand-300 text-stone-900 font-medium py-3 px-4 rounded-xl transition-all disabled:opacity-50"
                                >
                                    <span className="text-2xl">{option.emoji}</span>
                                    <span className="flex-grow text-left">{option.label}</span>
                                    {addingBook && <Loader2 className="w-4 h-4 animate-spin text-brand-600" />}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setShowStatusModal(false)}
                            disabled={addingBook}
                            className="w-full mt-4 text-stone-500 hover:text-stone-700 font-medium py-2 transition-colors"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
