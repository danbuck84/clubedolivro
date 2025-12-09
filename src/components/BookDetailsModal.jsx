// BookDetailsModal.jsx
// Modal de detalhes do livro com gerenciamento completo

import React, { useState } from 'react';
import { X, Trash2, Loader2, BookMarked } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { updateBookStatus, updateBookProgress, removeBookFromShelf } from '../services/shelfService';

export default function BookDetailsModal({ book, onClose, onUpdate }) {
    const { user } = useAuth();
    const [status, setStatus] = useState(book.status);
    const [progress, setProgress] = useState(book.progress || 0);
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const statusOptions = [
        { value: 'Lendo', label: 'Lendo', emoji: '📖' },
        { value: 'Quero Ler', label: 'Quero Ler', emoji: '📚' },
        { value: 'Lido', label: 'Lido', emoji: '✓' },
    ];

    const handleStatusChange = async (newStatus) => {
        if (!user || newStatus === status) return;

        setLoading(true);

        try {
            await updateBookStatus(user.uid, book.id, newStatus);
            setStatus(newStatus);

            // Toast especial ao mover para "Lendo"
            if (newStatus === 'Lendo') {
                setSuccessMessage('📖 Livro movido para sua mesa de cabeceira!');
            } else {
                setSuccessMessage('✓ Status atualizado!');
            }

            setTimeout(() => setSuccessMessage(''), 3000);

            // Atualizar lista na página pai
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            alert('Erro ao atualizar status. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleProgressUpdate = async () => {
        if (!user) return;

        const newProgress = parseInt(progress);

        if (isNaN(newProgress) || newProgress < 0) {
            alert('Digite um número válido');
            return;
        }

        if (newProgress > book.pageCount) {
            alert(`O livro tem apenas ${book.pageCount} páginas`);
            return;
        }

        setLoading(true);

        try {
            await updateBookProgress(user.uid, book.id, newProgress);
            setSuccessMessage('✓ Progresso atualizado!');
            setTimeout(() => setSuccessMessage(''), 3000);

            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Erro ao atualizar progresso:', error);
            alert('Erro ao atualizar progresso. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!user) return;

        const confirm = window.confirm(`Tem certeza que deseja remover "${book.title}" da estante?`);
        if (!confirm) return;

        setDeleting(true);

        try {
            await removeBookFromShelf(user.uid, book.id);
            setSuccessMessage('✓ Livro removido da estante!');
            setTimeout(() => {
                if (onUpdate) onUpdate();
                onClose();
            }, 1000);
        } catch (error) {
            console.error('Erro ao remover livro:', error);
            alert('Erro ao remover livro. Tente novamente.');
            setDeleting(false);
        }
    };

    const showProgressInput = status === 'Lendo' || status === 'Lido';

    return (
        <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8 relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Toast de sucesso */}
                {successMessage && (
                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full shadow-xl whitespace-nowrap">
                        {successMessage}
                    </div>
                )}

                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-stone-200">
                    <div className="flex items-center gap-3">
                        <BookMarked className="w-6 h-6 text-brand-600" />
                        <h2 className="font-serif text-2xl font-bold text-stone-900">
                            Detalhes do Livro
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-stone-500" />
                    </button>
                </div>

                {/* Conteúdo */}
                <div className="p-6">
                    {/* Livro Info */}
                    <div className="flex flex-col md:flex-row gap-6 mb-6">
                        {/* Capa */}
                        <div className="flex-shrink-0">
                            <img
                                src={book.coverUrl}
                                alt={book.title}
                                className="w-40 h-60 rounded-lg shadow-lg object-cover mx-auto md:mx-0"
                            />
                        </div>

                        {/* Informações */}
                        <div className="flex-grow">
                            <h3 className="font-serif text-3xl font-bold text-stone-900 mb-2 leading-tight">
                                {book.title}
                            </h3>
                            <p className="text-lg text-stone-600 mb-4">
                                {book.authors.join(', ')}
                            </p>

                            {book.description && (
                                <p className="text-sm text-stone-600 line-clamp-4 mb-4">
                                    {book.description}
                                </p>
                            )}

                            <div className="flex gap-4 text-sm text-stone-500">
                                {book.pageCount > 0 && (
                                    <span>📄 {book.pageCount} páginas</span>
                                )}
                                {book.publishedDate && (
                                    <span>📅 {book.publishedDate.substring(0, 4)}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Controles */}
                    <div className="space-y-4 border-t border-stone-200 pt-6">
                        {/* Status Dropdown */}
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-2">
                                Status
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {statusOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => handleStatusChange(option.value)}
                                        disabled={loading || deleting}
                                        className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all border-2 ${status === option.value
                                                ? 'bg-brand-50 border-brand-300 text-brand-700'
                                                : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                                            } disabled:opacity-50`}
                                    >
                                        <span className="text-lg">{option.emoji}</span>
                                        <span className="text-sm">{option.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Progresso (apenas se Lendo ou Lido) */}
                        {showProgressInput && (
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-2">
                                    Progresso de Leitura
                                </label>
                                <div className="flex gap-3 items-center">
                                    <span className="text-sm text-stone-600">Estou na página</span>
                                    <input
                                        type="number"
                                        value={progress}
                                        onChange={(e) => setProgress(e.target.value)}
                                        min="0"
                                        max={book.pageCount}
                                        disabled={loading || deleting}
                                        className="w-24 px-3 py-2 border-2 border-stone-200 rounded-lg focus:outline-none focus:border-brand-500 text-center font-semibold disabled:opacity-50"
                                    />
                                    <span className="text-sm text-stone-600">de {book.pageCount}</span>
                                    <button
                                        onClick={handleProgressUpdate}
                                        disabled={loading || deleting || progress == book.progress}
                                        className="ml-auto px-4 py-2 bg-brand-700 text-white font-medium rounded-lg hover:bg-brand-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                    >
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar'}
                                    </button>
                                </div>

                                {/* Barra de progresso */}
                                <div className="mt-4">
                                    <div className="flex justify-between text-xs text-stone-600 mb-1">
                                        <span>{Math.round((progress / book.pageCount) * 100)}% concluído</span>
                                    </div>
                                    <div className="w-full bg-stone-100 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-brand-400 to-brand-600 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${Math.min((progress / book.pageCount) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-stone-200 flex justify-between items-center bg-stone-50">
                    <button
                        onClick={handleDelete}
                        disabled={deleting || loading}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium text-sm px-4 py-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {deleting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Trash2 className="w-4 h-4" />
                        )}
                        Remover da estante
                    </button>

                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-stone-900 text-white font-medium rounded-lg hover:bg-stone-800 transition-colors"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
}
