import { toHttps } from "@/lib/utils";

const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";

export interface GoogleBook {
    id: string;
    volumeInfo: {
        title: string;
        authors?: string[];
        imageLinks?: {
            thumbnail?: string;
            smallThumbnail?: string;
        };
        pageCount?: number;
        publishedDate?: string;
        description?: string;
    };
}

export interface FormattedBook {
    googleId: string;
    title: string;
    authors: string[];
    coverUrl: string;
    pageCount: number;
    publishedDate: string;
    description: string;
}

/**
 * Search books on Google Books API
 */
export async function searchBooks(searchTerm: string): Promise<FormattedBook[]> {
    if (!searchTerm.trim()) return [];

    try {
        const response = await fetch(
            `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(searchTerm)}&maxResults=20&langRestrict=pt`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch books");
        }

        const data = await response.json();
        const books: GoogleBook[] = data.items || [];

        return books.map((book) => formatBook(book));
    } catch (error) {
        console.error("Error searching books:", error);
        return [];
    }
}

/**
 * Format Google Books API response
 */
function formatBook(book: GoogleBook): FormattedBook {
    const { volumeInfo } = book;

    // Get cover URL and enforce HTTPS
    const coverUrl = toHttps(
        volumeInfo.imageLinks?.thumbnail ||
        volumeInfo.imageLinks?.smallThumbnail
    );

    return {
        googleId: book.id,
        title: volumeInfo.title || "Título desconhecido",
        authors: volumeInfo.authors || ["Autor desconhecido"],
        coverUrl,
        pageCount: volumeInfo.pageCount || 0,
        publishedDate: volumeInfo.publishedDate || "",
        description: volumeInfo.description || "Sem descrição disponível",
    };
}
