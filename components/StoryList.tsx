'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { SerializedStory } from '@/types/story';
import { StoryCard } from './StoryCard';
import { deleteStory } from '@/lib/actions/storyActions';

interface StoryListProps {
  stories: SerializedStory[];
  showActions?: boolean;
}

export function StoryList({ stories, showActions = false }: StoryListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
      return;
    }

    setDeletingId(id);
    startTransition(async () => {
      try {
        const result = await deleteStory(id);
        if (result.success) {
          router.refresh();
        } else {
          alert(result.error || 'Failed to delete story');
        }
      } catch (error) {
        console.error('Delete error:', error);
        alert('An unexpected error occurred');
      } finally {
        setDeletingId(null);
      }
    });
  };

  if (stories.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🌙</div>
        <h3 className="text-xl font-semibold text-indigo-200 mb-2">
          No stories yet
        </h3>
        <p className="text-indigo-300/60">
          Be the first to share a magical bedtime story!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {stories.map((story) => (
        <div
          key={story.id}
          className={`transition-opacity ${
            deletingId === story.id && isPending ? 'opacity-50' : 'opacity-100'
          }`}
        >
          <StoryCard
            story={story}
            showActions={showActions}
            onDelete={() => handleDelete(story.id)}
          />
        </div>
      ))}
    </div>
  );
}
