'use server';

import { db } from '@/lib/firebase';
import { SerializedStory, StoryCategory } from '@/types/story';
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

const STORIES_COLLECTION = 'stories';

// Helper to serialize timestamp
function serializeTimestamp(timestamp: Timestamp | null | undefined): string {
  if (!timestamp) return new Date().toISOString();
  return timestamp.toDate().toISOString();
}

// Create a new story
export async function createStory(data: {
  title: string;
  content: string;
  category: StoryCategory;
  authorId: string;
  authorName?: string;
}): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const docRef = await addDoc(collection(db, STORIES_COLLECTION), {
      title: data.title,
      content: data.content,
      category: data.category,
      authorId: data.authorId,
      authorName: data.authorName || 'Anonymous',
      likeCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    revalidatePath('/');
    revalidatePath('/stories');

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating story:', error);
    return { success: false, error: 'Failed to create story' };
  }
}

// Get all stories (returns serialized stories for client components)
export async function getStories(): Promise<SerializedStory[]> {
  try {
    const q = query(
      collection(db, STORIES_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);

    const stories: SerializedStory[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      stories.push({
        id: doc.id,
        title: data.title,
        content: data.content,
        category: data.category || 'adventure',
        authorId: data.authorId,
        authorName: data.authorName,
        likeCount: data.likeCount || 0,
        createdAt: serializeTimestamp(data.createdAt),
        updatedAt: data.updatedAt ? serializeTimestamp(data.updatedAt) : undefined,
      });
    });

    return stories;
  } catch (error) {
    console.error('Error fetching stories:', error);
    return [];
  }
}

// Get stories by author ID
export async function getStoriesByAuthor(authorId: string): Promise<SerializedStory[]> {
  try {
    const q = query(
      collection(db, STORIES_COLLECTION),
      where('authorId', '==', authorId)
    );
    const querySnapshot = await getDocs(q);

    const stories: SerializedStory[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      stories.push({
        id: doc.id,
        title: data.title,
        content: data.content,
        category: data.category || 'adventure',
        authorId: data.authorId,
        authorName: data.authorName,
        likeCount: data.likeCount || 0,
        createdAt: serializeTimestamp(data.createdAt),
        updatedAt: data.updatedAt ? serializeTimestamp(data.updatedAt) : undefined,
      });
    });

    // Sort by createdAt on the client side to avoid needing a composite index
    return stories.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error('Error fetching stories by author:', error);
    return [];
  }
}

// Get a single story by ID (returns serialized story for client components)
export async function getStoryById(id: string): Promise<SerializedStory | null> {
  try {
    const docRef = doc(db, STORIES_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    return {
      id: docSnap.id,
      title: data.title,
      content: data.content,
      category: data.category || 'adventure',
      authorId: data.authorId,
      authorName: data.authorName,
      likeCount: data.likeCount || 0,
      createdAt: serializeTimestamp(data.createdAt),
      updatedAt: data.updatedAt ? serializeTimestamp(data.updatedAt) : undefined,
    };
  } catch (error) {
    console.error('Error fetching story:', error);
    return null;
  }
}

// Update a story
export async function updateStory(
  id: string,
  data: {
    title?: string;
    content?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const docRef = doc(db, STORIES_COLLECTION, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });

    revalidatePath('/');
    revalidatePath('/stories');
    revalidatePath(`/stories/${id}`);

    return { success: true };
  } catch (error) {
    console.error('Error updating story:', error);
    return { success: false, error: 'Failed to update story' };
  }
}

// Delete a story
export async function deleteStory(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const docRef = doc(db, STORIES_COLLECTION, id);
    await deleteDoc(docRef);

    revalidatePath('/');
    revalidatePath('/stories');

    return { success: true };
  } catch (error) {
    console.error('Error deleting story:', error);
    return { success: false, error: 'Failed to delete story' };
  }
}
