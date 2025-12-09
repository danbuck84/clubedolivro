// userService.js
// Serviço para gerenciamento de usuários no Firestore

import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';

/**
 * Verifica se o usuário existe no Firestore.
 * Se não existir, cria um novo documento com dados iniciais.
 * Se existir, atualiza apenas o lastLoginAt.
 * 
 * @param {Object} firebaseUser - Objeto do usuário retornado pelo Firebase Auth
 */
export async function checkOrCreateUser(firebaseUser) {
    if (!firebaseUser) return;

    const userRef = doc(db, 'users', firebaseUser.uid);

    try {
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            // Usuário não existe - criar novo documento
            console.log('Criando novo usuário no Firestore:', firebaseUser.uid);

            await setDoc(userRef, {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName || 'Leitor',
                photoURL: firebaseUser.photoURL || null,
                yearlyGoal: 0,
                stats: {
                    booksRead: 0,
                    booksReading: 0,
                    booksToRead: 0,
                    totalPages: 0
                },
                createdAt: serverTimestamp(),
                lastLoginAt: serverTimestamp()
            });

            console.log('Usuário criado com sucesso!');
        } else {
            // Usuário já existe - atualizar apenas o lastLoginAt
            console.log('Atualizando lastLoginAt do usuário:', firebaseUser.uid);

            await updateDoc(userRef, {
                lastLoginAt: serverTimestamp()
            });

            console.log('LastLoginAt atualizado!');
        }
    } catch (error) {
        console.error('Erro ao verificar/criar usuário:', error);
        throw error;
    }
}
