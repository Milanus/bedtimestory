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
  increment,
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
  description?: string;
  content: string;
  category: StoryCategory;
  authorId: string;
  authorName?: string;
  imageUrl?: string;
  soundUrl?: string;
  youtubeUrl?: string;
}): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const storyData = {
      title: data.title,
      description: data.description || null,
      content: data.content,
      category: data.category,
      authorId: data.authorId,
      authorName: data.authorName || 'Anonymous',
      imageUrl: data.imageUrl || null,
      soundUrl: data.soundUrl || null,
      youtubeUrl: data.youtubeUrl || null,
      likeCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, STORIES_COLLECTION), storyData);

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
    const storiesRef = collection(db, 'stories');
    const q = query(storiesRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const stories = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        category: data.category || 'adventure',
        imageUrl: data.imageUrl || undefined,
        soundUrl: data.soundUrl || undefined,
        createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString(),
      } as SerializedStory;
    });

    // Sort by createdAt on client side
    return stories.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Error fetching stories:', error);
    return [];
  }
}

// Get stories by author ID
export async function getStoriesByAuthor(authorId: string): Promise<SerializedStory[]> {
  try {
    const storiesRef = collection(db, 'stories');
    const q = query(storiesRef, where('authorId', '==', authorId));
    const querySnapshot = await getDocs(q);
    
    const stories = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        category: data.category || 'adventure',
        imageUrl: data.imageUrl || undefined,
        soundUrl: data.soundUrl || undefined,
        youtubeUrl: data.youtubeUrl || undefined,
        createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString(),
      } as SerializedStory;
    });

    // Sort by createdAt on client side
    return stories.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Error fetching stories by author:', error);
    return [];
  }
}

// Get a single story by ID (returns serialized story for client components)
export async function getStoryById(id: string): Promise<SerializedStory | null> {
  try {
    const storyRef = doc(db, 'stories', id);
    const storyDoc = await getDoc(storyRef);
    
    if (!storyDoc.exists()) {
      return null;
    }

    const data = storyDoc.data();
    return {
      id: storyDoc.id,
      ...data,
      category: data.category || 'adventure',
      imageUrl: data.imageUrl || undefined,
      soundUrl: data.soundUrl || undefined,
      youtubeUrl: data.youtubeUrl || undefined,
      createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
      updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString(),
    } as SerializedStory;
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
    description?: string;
    content?: string;
    category?: string;
    imageUrl?: string;
    soundUrl?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const storyRef = doc(db, 'stories', id);
    await updateDoc(storyRef, {
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
    const storyRef = doc(db, 'stories', id);
    await deleteDoc(storyRef);

    revalidatePath('/');
    revalidatePath('/stories');

    return { success: true };
  } catch (error) {
    console.error('Error deleting story:', error);
    return { success: false, error: 'Failed to delete story' };
  }
}

// Toggle like on a story
export async function toggleLike(storyId: string, shouldIncrement: boolean): Promise<void> {
  try {
    const storyRef = doc(db, 'stories', storyId);
    const { increment: incrementValue } = await import('firebase/firestore');
    await updateDoc(storyRef, {
      likeCount: incrementValue(shouldIncrement ? 1 : -1),
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
}
