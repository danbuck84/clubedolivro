// googleBooks.js
// Integração com Google Books API

const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';
const PLACEHOLDER_COVER = 'https://placehold.co/400x600/d47321/white?text=Sem+Capa';

/**
 * Busca livros na Google Books API
 * @param {string} query - Termo de busca
 * @returns {Promise<Array>} Array de livros formatados
 */
export async function searchBooks(query) {
    if (!query || query.trim().length === 0) {
        return [];
    }

    try {
        const url = `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(query)}&langRestrict=pt&maxResults=20`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Erro ao buscar livros');
        }

        const data = await response.json();

        if (!data.items || data.items.length === 0) {
            return [];
        }

        // Formatar dados para o formato esperado
        return data.items.map(book => {
            const volumeInfo = book.volumeInfo || {};

            return {
                id: book.id,
                title: volumeInfo.title || 'Título Desconhecido',
                authors: volumeInfo.authors || ['Autor Desconhecido'],
                description: volumeInfo.description || '',
                pageCount: volumeInfo.pageCount || 0,
                coverUrl: (volumeInfo.imageLinks?.thumbnail || PLACEHOLDER_COVER).replace('http:', 'https:'),
                isbn: volumeInfo.industryIdentifiers?.[0]?.identifier || null,
                publishedDate: volumeInfo.publishedDate || null,
                publisher: volumeInfo.publisher || null,
            };
        });
    } catch (error) {
        console.error('Erro ao buscar livros:', error);
        throw error;
    }
}

/**
 * Busca detalhes de um livro específico
 * @param {string} bookId - ID do livro na Google Books
 * @returns {Promise<Object>} Dados do livro
 */
export async function getBookDetails(bookId) {
    try {
        const url = `${GOOGLE_BOOKS_API}/${bookId}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Erro ao buscar detalhes do livro');
        }

        const data = await response.json();
        const volumeInfo = data.volumeInfo || {};

        return {
            id: data.id,
            title: volumeInfo.title || 'Título Desconhecido',
            authors: volumeInfo.authors || ['Autor Desconhecido'],
            description: volumeInfo.description || '',
            pageCount: volumeInfo.pageCount || 0,
            coverUrl: (volumeInfo.imageLinks?.thumbnail || PLACEHOLDER_COVER).replace('http:', 'https:'),
            isbn: volumeInfo.industryIdentifiers?.[0]?.identifier || null,
            publishedDate: volumeInfo.publishedDate || null,
            publisher: volumeInfo.publisher || null,
        };
    } catch (error) {
        console.error('Erro ao buscar detalhes do livro:', error);
        throw error;
    }
}
