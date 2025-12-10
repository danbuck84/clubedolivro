import { db } from "@/lib/firebase";
import {
    collection,
    query,
    where,
    getDocs,
    doc,
    setDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    Timestamp,
} from "firebase/firestore";

export interface Book {
    id: string;
    googleId: string;
    title: string;
    authors: string[];
    coverUrl: string;
    pageCount: number;
    publishedDate: string;
    description: string;
    status: "quero-ler" | "lendo" | "lido";
    progress?: number; // current page
    userId: string;
    addedAt?: any;
    updatedAt?: any;
}

/**
 * Get all books for a user
 */
export async function getUserBooks(userId: string): Promise<Book[]> {
    const q = query(
        collection(db, "books"),
        where("userId", "==", userId)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Book));
}

/**
 * Add book to user's shelf
 */
export async function addBookToShelf(
    userId: string,
    book: {
        googleId: string;
        title: string;
        authors: string[];
        coverUrl: string;
        pageCount: number;
        publishedDate: string;
        description: string;
    },
    status: "quero-ler" | "lendo" | "lido"
): Promise<void> {
    const newDocRef = doc(collection(db, "books"));

    await setDoc(newDocRef, {
        ...book,
        status,
        progress: status === "lendo" ? 0 : undefined,
        userId,
        addedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
}

/**
 * Update book progress
 */
export async function updateBookProgress(
    bookId: string,
    progress: number
): Promise<void> {
    const docRef = doc(db, "books", bookId);
    await updateDoc(docRef, {
        progress,
        updatedAt: serverTimestamp(),
    });
}

/**
 * Update book status
 */
export async function updateBookStatus(
    bookId: string,
    status: "quero-ler" | "lendo" | "lido"
): Promise<void> {
    const docRef = doc(db, "books", bookId);

    const updateData: any = {
        status,
        updatedAt: serverTimestamp(),
    };

    // Reset progress if not "lendo"
    if (status !== "lendo") {
        updateData.progress = null;
    } else if (status === "lendo") {
        updateData.progress = 0;
    }

    await updateDoc(docRef, updateData);
}

/**
 * Remove book from shelf
 */
export async function removeBook(bookId: string): Promise<void> {
    const docRef = doc(db, "books", bookId);
    await deleteDoc(docRef);
}
