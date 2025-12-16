import { Timestamp } from 'firebase/firestore';

// Story categories
export const STORY_CATEGORIES = [
  { value: 'adventure', label: 'Adventure', emoji: '🗺️' },
  { value: 'fantasy', label: 'Fantasy', emoji: '🧚' },
  { value: 'animals', label: 'Animals', emoji: '🐻' },
  { value: 'fairy-tale', label: 'Fairy Tale', emoji: '👸' },
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
  content: string;
  category: StoryCategory;
  authorId: string;
  authorName?: string;
  likeCount: number;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

// Serialized Story type for client components
export interface SerializedStory {
  id: string;
  title: string;
  content: string;
  category: StoryCategory;
  authorId: string;
  authorName?: string;
  likeCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface StoryLike {
  createdAt: Timestamp;
}

// Helper function to serialize a story for client components
export function serializeStory(story: Story): SerializedStory {
  return {
    id: story.id,
    title: story.title,
    content: story.content,
    category: story.category,
    authorId: story.authorId,
    authorName: story.authorName,
    likeCount: story.likeCount,
    createdAt: story.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    updatedAt: story.updatedAt?.toDate?.()?.toISOString(),
  };
}
