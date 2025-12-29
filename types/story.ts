import { Timestamp } from 'firebase/firestore';

// Story categories
export const STORY_CATEGORIES = [
  { value: 'adventure', label: 'Adventure', emoji: '🗺️' },
  { value: 'fantasy', label: 'Fantasy', emoji: '🧚' },
  { value: 'animals', label: 'Animals', emoji: '🐻' },
  { value: 'fairytale', label: 'Fairy Tale', emoji: '👸' },
  { value: 'nature', label: 'Nature', emoji: '🌲' },
  { value: 'space', label: 'Space', emoji: '🚀' },
  { value: 'friendship', label: 'Friendship', emoji: '💕' },
  { value: 'mystery', label: 'Mystery', emoji: '🔮' },
  { value: 'funny', label: 'Funny', emoji: '😄' },
  { value: 'magical', label: 'Magical', emoji: '✨' },
] as const;

export type StoryCategory = typeof STORY_CATEGORIES[number]['value'];

// Firebase Timestamp type for internal use
export interface Story {
  id: string;
  title: string;
  description?: string;   // Short description/subtitle
  content: string;
  authorId: string;
  authorName: string;
  category: StoryCategory;
  imageUrl?: string;      // New: URL to title image
  soundUrl?: string;      // New: URL to background sound
  youtubeUrl: string;     // YouTube link
  likeCount: number;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

// Serialized Story type for client components
export interface SerializedStory {
  id: string;
  title: string;
  description?: string;   // Short description/subtitle
  content: string;
  authorId: string;
  authorName: string;
  category: StoryCategory;
  imageUrl?: string;      // New: URL to title image
  soundUrl?: string;      // New: URL to background sound
  youtubeUrl?: string;    // YouTube link
  likeCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface StoryLike {
  createdAt: Timestamp;
}

// Like in top-level likes collection
export interface Like {
  id: string;
  userId: string;
  storyId: string;
  createdAt: Timestamp | Date;
}

// Serialized Like for client components
export interface SerializedLike {
  id: string;
  userId: string;
  storyId: string;
  createdAt: string;
}

// Helper function to serialize a story for client components
export function serializeStory(story: Story): SerializedStory {
  const toISOString = (dateOrTimestamp: Timestamp | Date | undefined): string => {
    if (!dateOrTimestamp) return new Date().toISOString();
    if (dateOrTimestamp instanceof Date) return dateOrTimestamp.toISOString();
    return dateOrTimestamp.toDate().toISOString();
  };

  return {
    id: story.id,
    title: story.title,
    content: story.content,
    category: story.category,
    authorId: story.authorId,
    authorName: story.authorName,
    imageUrl: story.imageUrl,
    soundUrl: story.soundUrl,
    youtubeUrl: story.youtubeUrl || undefined,
    likeCount: story.likeCount,
    createdAt: toISOString(story.createdAt),
    updatedAt: toISOString(story.updatedAt),
  };
}
