'use server';

import { checkIfUserIsAdmin as checkAdmin } from '@/lib/firebase-admin';
import { collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User } from '@/types/user';

export async function checkIfUserIsAdmin(userId: string): Promise<boolean> {
  return checkAdmin(userId);
}

export async function getAllUsers(): Promise<User[]> {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        uid: data.uid || doc.id,
        email: data.email || '',
        displayName: data.displayName || 'Unknown User',
        isAdmin: data.isAdmin || false,
        createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString(),
      } as User;
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

export async function toggleUserAdminStatus(userId: string, isAdmin: boolean) {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      isAdmin,
      updatedAt: new Date(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating user admin status:', error);
    return { success: false, error };
  }
}
