import { db } from "@/lib/firebase";
import {
    collection,
    query,
    where,
    orderBy,
    limit,
    getDocs,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    Timestamp,
    serverTimestamp,
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
    createdAt?: any;
    updatedAt?: any;
}

/**
 * Get all meetings split by upcoming/past
 */
export async function getAllMeetings(): Promise<{
    upcoming: Meeting[];
    past: Meeting[];
}> {
    const now = Timestamp.now();

    const snapshot = await getDocs(
        query(collection(db, "meetings"), orderBy("date", "desc"))
    );

    const all = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Meeting)
    );

    const upcoming = all.filter((m) => m.date.toMillis() >= now.toMillis());
    const past = all.filter((m) => m.date.toMillis() < now.toMillis());

    return { upcoming: upcoming.reverse(), past };
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

    const docSnap = snapshot.docs[0];
    return {
        id: docSnap.id,
        ...docSnap.data(),
    } as Meeting;
}

/**
 * Get meeting by ID
 */
export async function getMeetingById(id: string): Promise<Meeting | null> {
    const docRef = doc(db, "meetings", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        return null;
    }

    return {
        id: docSnap.id,
        ...docSnap.data(),
    } as Meeting;
}

/**
 * Create new meeting
 */
export async function createMeeting(data: {
    bookTitle: string;
    date: Date;
    time: string;
    locationName: string;
    locationLink?: string;
}): Promise<string> {
    const newDocRef = doc(collection(db, "meetings"));

    await setDoc(newDocRef, {
        ...data,
        date: Timestamp.fromDate(data.date),
        rsvps: {},
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });

    return newDocRef.id;
}

/**
 * Update existing meeting
 */
export async function updateMeeting(
    id: string,
    data: {
        bookTitle: string;
        date: Date;
        time: string;
        locationName: string;
        locationLink?: string;
    }
): Promise<void> {
    const docRef = doc(db, "meetings", id);

    await updateDoc(docRef, {
        ...data,
        date: Timestamp.fromDate(data.date),
        updatedAt: serverTimestamp(),
    });
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
    const meeting = await getMeetingById(meetingId);

    if (!meeting) return;

    const rsvps = meeting.rsvps || {};

    if (rsvps[userId]) {
        delete rsvps[userId];
    } else {
        rsvps[userId] = userData;
    }

    await updateDoc(meetingRef, { rsvps });
}

/**
 * Check if user has RSVP'd
 */
export function hasUserRSVP(
    meeting: Meeting | null,
    userId: string | undefined
): boolean {
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
