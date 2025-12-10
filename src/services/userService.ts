import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export interface UserData {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
}

/**
 * Creates or updates user document in Firestore
 */
export async function createOrUpdateUser(userData: UserData): Promise<void> {
    const userRef = doc(db, "users", userData.uid);

    await setDoc(
        userRef,
        {
            ...userData,
            updatedAt: serverTimestamp(),
        },
        { merge: true }
    );
}
