'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteStory } from '@/lib/actions/storyActions';

interface DeleteStoryButtonProps {
  storyId: string;
}

export function DeleteStoryButton({ storyId }: DeleteStoryButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const result = await deleteStory(storyId);
        if (result.success) {
          router.push('/');
          router.refresh();
        } else {
          alert(result.error || 'Failed to delete story');
        }
      } catch (error) {
        console.error('Delete error:', error);
        alert('An unexpected error occurred');
      }
    });
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-red-300 text-sm">Delete?</span>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm transition-colors disabled:opacity-50"
        >
          {isPending ? 'Deleting...' : 'Yes'}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          disabled={isPending}
          className="px-3 py-1.5 bg-gray-600/50 hover:bg-gray-600 text-gray-200 rounded-lg text-sm transition-colors"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="px-4 py-2 bg-red-600/30 hover:bg-red-600/50 text-red-200 rounded-lg text-sm transition-colors"
    >
      Delete
    </button>
  );
}

export default DeleteStoryButton;
