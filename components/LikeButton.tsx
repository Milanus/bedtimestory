'use client';

import { useState, useTransition } from 'react';
import { Heart } from 'lucide-react';
import { toggleLike } from '@/lib/actions/toggleLike';

interface LikeButtonProps {
  storyId: string;
  userId: string;
  initialLikeCount: number;
  initialUserHasLiked: boolean;
}

export default function LikeButton({
  storyId,
  userId,
  initialLikeCount,
  initialUserHasLiked,
}: LikeButtonProps) {
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [hasLiked, setHasLiked] = useState(initialUserHasLiked);
  const [isPending, startTransition] = useTransition();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = async () => {
    // Prevent multiple clicks while processing
    if (isPending) return;

    // Store previous state for rollback
    const previousLikeCount = likeCount;
    const previousHasLiked = hasLiked;

    // Optimistic UI update
    setHasLiked(!hasLiked);
    setLikeCount((prev) => (hasLiked ? Math.max(0, prev - 1) : prev + 1));
    setIsAnimating(true);

    // Reset animation after it completes
    setTimeout(() => setIsAnimating(false), 300);

    startTransition(async () => {
      try {
        const result = await toggleLike(storyId, userId);
        // Update with actual server values
        setHasLiked(result.liked);
        setLikeCount(result.likeCount);
      } catch (error) {
        // Revert optimistic update on error
        console.error('Failed to toggle like:', error);
        setHasLiked(previousHasLiked);
        setLikeCount(previousLikeCount);
      }
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg
        transition-all duration-200 ease-in-out
        hover:bg-gray-100 dark:hover:bg-gray-800
        focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2
        disabled:cursor-not-allowed disabled:opacity-70
        ${hasLiked ? 'text-pink-500' : 'text-gray-500 dark:text-gray-400'}
      `}
      aria-label={hasLiked ? 'Unlike this story' : 'Like this story'}
      aria-pressed={hasLiked}
    >
      <Heart
        className={`
          w-6 h-6 transition-all duration-200
          ${hasLiked ? 'fill-pink-500 stroke-pink-500' : 'fill-none stroke-current'}
          ${isAnimating ? 'scale-125' : 'scale-100'}
        `}
      />
      <span className="text-sm font-medium tabular-nums">
        {likeCount.toLocaleString()}
      </span>
    </button>
  );
}
