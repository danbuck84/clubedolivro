// shelfService.js
// Gerenciamento de biblioteca pessoal no Firestore

import { doc, setDoc, getDoc, collection, getDocs, updateDoc, deleteDoc, serverTimestamp, query, where } from 'firebase/firestore';
import { db } from './firebaseConfig';

/**
 * Adiciona um livro à estante do usuário
 * @param {string} userId - ID do usuário
 * @param {Object} bookData - Dados do livro
 * @param {string} status - Status do livro ('Lendo', 'Lido', 'Quero Ler')
 * @returns {Promise<void>}
 */
export async function addBookToShelf(userId, bookData, status = 'Quero Ler') {
    try {
        // 1. Salvar/atualizar livro na coleção global 'books'
        const bookRef = doc(db, 'books', bookData.id);
        const bookSnap = await getDoc(bookRef);

        if (!bookSnap.exists()) {
            // Livro não existe na coleção global, criar
            await setDoc(bookRef, {
                id: bookData.id,
                title: bookData.title,
                authors: bookData.authors,
                description: bookData.description,
                pageCount: bookData.pageCount,
                coverUrl: bookData.coverUrl,
                isbn: bookData.isbn || null,
                publishedDate: bookData.publishedDate || null,
                publisher: bookData.publisher || null,
                createdAt: serverTimestamp(),
            });
        }

        // 2. Adicionar livro à biblioteca do usuário (subcoleção)
        const libraryRef = doc(db, 'users', userId, 'library', bookData.id);
        await setDoc(libraryRef, {
            status,
            progress: 0,
            addedAt: serverTimestamp(),
            rating: null,
            notes: '',
        });

        return { success: true };
    } catch (error) {
        console.error('Erro ao adicionar livro à estante:', error);
        throw error;
    }
}

/**
 * Busca todos os livros da biblioteca do usuário
 * @param {string} userId - ID do usuário
 * @returns {Promise<Array>} Array de livros com dados da biblioteca
 */
export async function getUserLibrary(userId) {
    try {
        const libraryRef = collection(db, 'users', userId, 'library');
        const librarySnap = await getDocs(libraryRef);

        const books = [];

        for (const docSnap of librarySnap.docs) {
            const libraryData = docSnap.data();

            // Buscar dados completos do livro na coleção global
            const bookRef = doc(db, 'books', docSnap.id);
            const bookSnap = await getDoc(bookRef);

            if (bookSnap.exists()) {
                books.push({
                    ...bookSnap.data(),
                    ...libraryData,
                });
            }
        }

        return books;
    } catch (error) {
        console.error('Erro ao buscar biblioteca do usuário:', error);
        throw error;
    }
}

/**
 * Atualiza o progresso de leitura de um livro
 * @param {string} userId - ID do usuário
 * @param {string} bookId - ID do livro
 * @param {number} progress - Página atual
 * @returns {Promise<void>}
 */
export async function updateBookProgress(userId, bookId, progress) {
    try {
        const libraryRef = doc(db, 'users', userId, 'library', bookId);
        await updateDoc(libraryRef, {
            progress,
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error('Erro ao atualizar progresso:', error);
        throw error;
    }
}

/**
 * Atualiza o status de um livro
 * @param {string} userId - ID do usuário
 * @param {string} bookId - ID do livro
 * @param {string} status - Novo status
 * @returns {Promise<void>}
 */
export async function updateBookStatus(userId, bookId, status) {
    try {
        const libraryRef = doc(db, 'users', userId, 'library', bookId);
        await updateDoc(libraryRef, {
            status,
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
        throw error;
    }
}

/**
 * Remove um livro da biblioteca do usuário
 * @param {string} userId - ID do usuário
 * @param {string} bookId - ID do livro
 * @returns {Promise<void>}
 */
export async function removeBookFromShelf(userId, bookId) {
    try {
        const libraryRef = doc(db, 'users', userId, 'library', bookId);
        await deleteDoc(libraryRef);
    } catch (error) {
        console.error('Erro ao remover livro:', error);
        throw error;
    }
}
