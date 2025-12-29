'use server';

import { db } from '@/lib/firebase';
import { SerializedLike } from '@/types/story';
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp,
} from 'firebase/firestore';

const LIKES_COLLECTION = 'likes';

/**
 * Get all likes for a specific story
 */
export async function getLikesByStory(storyId: string): Promise<SerializedLike[]> {
  try {
    const likesRef = collection(db, LIKES_COLLECTION);
    const q = query(
      likesRef,
      where('storyId', '==', storyId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        storyId: data.storyId,
        createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
      } as SerializedLike;
    });
  } catch (error) {
    console.error('Error fetching likes by story:', error);
    return [];
  }
}

/**
 * Get all likes by a specific user
 */
export async function getLikesByUser(userId: string): Promise<SerializedLike[]> {
  try {
    const likesRef = collection(db, LIKES_COLLECTION);
    const q = query(
      likesRef,
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    
    const likes = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        storyId: data.storyId,
        createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
      } as SerializedLike;
    });
    
    // Sort on client side to avoid needing a Firestore index
    likes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return likes;
  } catch (error) {
    console.error('Error fetching likes by user:', error);
    return [];
  }
}

/**
 * Get all likes (for admin purposes)
 */
export async function getAllLikes(): Promise<SerializedLike[]> {
  try {
    const likesRef = collection(db, LIKES_COLLECTION);
    const q = query(likesRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        storyId: data.storyId,
        createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
      } as SerializedLike;
    });
  } catch (error) {
    console.error('Error fetching all likes:', error);
    return [];
  }
}

/**
 * Get count of likes for a specific story
 */
export async function getLikeCountForStory(storyId: string): Promise<number> {
  try {
    const likesRef = collection(db, LIKES_COLLECTION);
    const q = query(likesRef, where('storyId', '==', storyId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.size;
  } catch (error) {
    console.error('Error counting likes for story:', error);
    return 0;
  }
}

/**
 * Get count of likes by a specific user
 */
export async function getLikeCountByUser(userId: string): Promise<number> {
  try {
    const likesRef = collection(db, LIKES_COLLECTION);
    const q = query(likesRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.size;
  } catch (error) {
    console.error('Error counting likes by user:', error);
    return 0;
  }
}
