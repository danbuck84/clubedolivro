// meetingService.js
// Gerenciamento de encontros no Firestore

import { collection, doc, setDoc, getDoc, getDocs, updateDoc, query, where, orderBy, limit, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';

/**
 * Cria um novo encontro
 * @param {Object} meetingData - Dados do encontro
 * @returns {Promise<string>} ID do encontro criado
 */
export async function createMeeting(meetingData) {
    try {
        const meetingsRef = collection(db, 'meetings');
        const newMeetingRef = doc(meetingsRef);

        await setDoc(newMeetingRef, {
            id: newMeetingRef.id,
            date: meetingData.date, // Timestamp
            time: meetingData.time, // string HH:mm
            locationName: meetingData.locationName,
            locationLink: meetingData.locationLink || '',
            bookTitle: meetingData.bookTitle || '',
            bookCover: meetingData.bookCover || '',
            createdBy: meetingData.createdBy,
            createdAt: serverTimestamp(),
            rsvps: {}
        });

        return newMeetingRef.id;
    } catch (error) {
        console.error('Erro ao criar encontro:', error);
        throw error;
    }
}

/**
 * Busca o próximo encontro (data >= hoje)
 * @returns {Promise<Object|null>} Próximo encontro ou null
 */
export async function getNextMeeting() {
    try {
        const now = Timestamp.now();
        const meetingsRef = collection(db, 'meetings');

        const q = query(
            meetingsRef,
            where('date', '>=', now),
            orderBy('date', 'asc'),
            limit(1)
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return null;
        }

        const meetingDoc = querySnapshot.docs[0];
        return {
            id: meetingDoc.id,
            ...meetingDoc.data()
        };
    } catch (error) {
        console.error('Erro ao buscar próximo encontro:', error);
        throw error;
    }
}

/**
 * Busca todos os encontros
 * @returns {Promise<Array>} Lista de encontros
 */
export async function getAllMeetings() {
    try {
        const meetingsRef = collection(db, 'meetings');
        const q = query(meetingsRef, orderBy('date', 'desc'));

        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Erro ao buscar encontros:', error);
        throw error;
    }
}

/**
 * Toggle RSVP do usuário em um encontro
 * @param {string} meetingId - ID do encontro
 * @param {string} userId - ID do usuário
 * @param {Object} userData - Dados do usuário (name, photoURL)
 * @returns {Promise<boolean>} true se adicionou, false se removeu
 */
export async function toggleRSVP(meetingId, userId, userData) {
    try {
        const meetingRef = doc(db, 'meetings', meetingId);
        const meetingSnap = await getDoc(meetingRef);

        if (!meetingSnap.exists()) {
            throw new Error('Encontro não encontrado');
        }

        const meeting = meetingSnap.data();
        const rsvps = meeting.rsvps || {};

        let isAdding = false;

        if (rsvps[userId]) {
            // Remover RSVP
            delete rsvps[userId];
        } else {
            // Adicionar RSVP
            rsvps[userId] = {
                name: userData.name,
                photoURL: userData.photoURL,
                confirmedAt: serverTimestamp()
            };
            isAdding = true;
        }

        await updateDoc(meetingRef, {
            rsvps
        });

        return isAdding;
    } catch (error) {
        console.error('Erro ao atualizar RSVP:', error);
        throw error;
    }
}

/**
 * Verifica se usuário já deu RSVP
 * @param {Object} meeting - Objeto do encontro
 * @param {string} userId - ID do usuário
 * @returns {boolean}
 */
export function hasUserRSVP(meeting, userId) {
    if (!meeting || !meeting.rsvps) return false;
    return !!meeting.rsvps[userId];
}

/**
 * Conta total de RSVPs
 * @param {Object} meeting - Objeto do encontro
 * @returns {number}
 */
export function countRSVPs(meeting) {
    if (!meeting || !meeting.rsvps) return 0;
    return Object.keys(meeting.rsvps).length;
}

/**
 * Busca um encontro específico por ID
 * @param {string} meetingId - ID do encontro
 * @returns {Promise<Object>} Dados do encontro
 */
export async function getMeetingById(meetingId) {
    try {
        const meetingRef = doc(db, 'meetings', meetingId);
        const meetingSnap = await getDoc(meetingRef);

        if (!meetingSnap.exists()) {
            throw new Error('Encontro não encontrado');
        }

        return {
            id: meetingSnap.id,
            ...meetingSnap.data()
        };
    } catch (error) {
        console.error('Erro ao buscar encontro:', error);
        throw error;
    }
}

/**
 * Atualiza um encontro existente
 * @param {string} meetingId - ID do encontro
 * @param {Object} updates - Dados a atualizar
 * @returns {Promise<void>}
 */
export async function updateMeeting(meetingId, updates) {
    try {
        const meetingRef = doc(db, 'meetings', meetingId);

        await updateDoc(meetingRef, {
            ...updates,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error('Erro ao atualizar encontro:', error);
        throw error;
    }
}
