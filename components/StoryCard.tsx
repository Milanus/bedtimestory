'use client';

import Link from 'next/link';
import { SerializedStory, STORY_CATEGORIES } from '@/types/story';
import LikeButton from './LikeButton';

interface StoryCardProps {
  story: SerializedStory;
  showActions?: boolean;
  onDelete?: (id: string) => void;
}

export function StoryCard({ story, showActions = false, onDelete }: StoryCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  };

  const getCategoryInfo = (categoryValue: string) => {
    return STORY_CATEGORIES.find(cat => cat.value === categoryValue) || STORY_CATEGORIES[0];
  };

  const categoryInfo = getCategoryInfo(story.category);

  return (
    <article className="group relative bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-sm rounded-2xl p-6 border border-indigo-500/20 hover:border-indigo-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 flex flex-col h-full">
      {/* Decorative stars */}
      <div className="absolute top-4 right-4 text-yellow-300/60 text-xs">✦</div>
      <div className="absolute top-8 right-8 text-yellow-300/40 text-[10px]">✦</div>
      
      {/* Category Badge */}
      <div className="mb-3">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-500/20 text-indigo-200 rounded-full text-xs font-medium">
          <span>{categoryInfo.emoji}</span>
          {categoryInfo.label}
        </span>
      </div>
      
      <Link href={`/stories/${story.id}`} className="block flex-1 flex flex-col">
        <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-indigo-200 transition-colors line-clamp-2">
          {story.title}
        </h2>
        
        <p className="text-indigo-200/70 text-sm mb-4 leading-relaxed line-clamp-3">
          {truncateContent(story.content)}
        </p>
      </Link>

      <div className="flex items-center justify-between text-xs text-indigo-300/60 mt-auto">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="text-indigo-400">✍</span>
            {story.authorName || 'Anonymous'}
          </span>
          <span>•</span>
          <span>{formatDate(story.createdAt)}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <LikeButton
            storyId={story.id}
            userId="anonymous"
            initialLikeCount={story.likeCount}
            initialUserHasLiked={false}
          />
        </div>
      </div>

      {showActions && (
        <div className="mt-4 pt-4 border-t border-indigo-500/20 flex gap-2">
          <Link
            href={`/stories/${story.id}/edit`}
            className="flex-1 text-center py-2 px-4 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 rounded-lg text-sm transition-colors"
          >
            Edit
          </Link>
          <button
            onClick={() => onDelete?.(story.id)}
            className="flex-1 py-2 px-4 bg-red-600/30 hover:bg-red-600/50 text-red-200 rounded-lg text-sm transition-colors"
          >
            Delete
          </button>
        </div>
      )}
    </article>
  );
}
