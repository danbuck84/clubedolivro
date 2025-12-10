import { db } from "@/lib/firebase";
import {
    collection,
    query,
    where,
    orderBy,
    limit,
    getDocs,
    doc,
    updateDoc,
    Timestamp,
} from "firebase/firestore";

export interface Meeting {
    id: string;
    bookTitle: string;
    date: Timestamp;
    time: string;
    locationName: string;
    locationLink?: string;
    rsvps: Record<string, {
        name: string;
        photoURL: string;
    }>;
}

/**
 * Get the next upcoming meeting
 */
export async function getNextMeeting(): Promise<Meeting | null> {
    const now = Timestamp.now();

    const q = query(
        collection(db, "meetings"),
        where("date", ">=", now),
        orderBy("date", "asc"),
        limit(1)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        return null;
    }

    const doc = snapshot.docs[0];
    return {
        id: doc.id,
        ...doc.data(),
    } as Meeting;
}

/**
 * Toggle RSVP for a meeting
 */
export async function toggleRSVP(
    meetingId: string,
    userId: string,
    userData: { name: string; photoURL: string }
): Promise<void> {
    const meetingRef = doc(db, "meetings", meetingId);

    const meeting = await getNextMeeting();
    if (!meeting) return;

    const rsvps = meeting.rsvps || {};

    if (rsvps[userId]) {
        // Remove RSVP
        delete rsvps[userId];
    } else {
        // Add RSVP
        rsvps[userId] = userData;
    }

    await updateDoc(meetingRef, { rsvps });
}

/**
 * Check if user has RSVP'd
 */
export function hasUserRSVP(meeting: Meeting | null, userId: string | undefined): boolean {
    if (!meeting || !userId) return false;
    return userId in (meeting.rsvps || {});
}

/**
 * Count RSVPs for a meeting
 */
export function countRSVPs(meeting: Meeting | null): number {
    if (!meeting) return 0;
    return Object.keys(meeting.rsvps || {}).length;
}
