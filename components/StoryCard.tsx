'use client';

import Link from 'next/link';
import { SerializedStory, STORY_CATEGORIES } from '@/types/story';
import { DeleteStoryButton } from './DeleteStoryButton';

interface StoryCardProps {
  story: SerializedStory;
  showActions?: boolean;
  onDelete?: () => void;
}

export function StoryCard({ story, showActions = false, onDelete }: StoryCardProps) {
  const categoryInfo = STORY_CATEGORIES.find(cat => cat.value === story.category) || STORY_CATEGORIES[0];

  return (
    <article className="group relative bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-indigo-500/20 hover:border-indigo-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 flex flex-col h-full">
      {/* Image Header */}
      {story.imageUrl && (
        <div className="relative w-full h-48 overflow-hidden">
          <img 
            src={story.imageUrl} 
            alt={story.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 to-transparent"></div>
        </div>
      )}
      
      <div className="p-6 flex flex-col flex-1">
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
          
          <p className="text-indigo-200/70 text-sm mb-4 line-clamp-3 flex-1">
            {story.content}
          </p>

          <div className="flex items-center justify-between mt-auto pt-4 border-t border-indigo-500/10">
            <span className="text-xs text-indigo-300/60">
              by {story.authorName}
            </span>
            <div className="flex items-center gap-3 text-xs text-indigo-300/60">
              {story.soundUrl && <span title="Has background sound">🔊</span>}
              <span>❤️ {story.likeCount}</span>
            </div>
          </div>
        </Link>

        {showActions && onDelete && (
          <div className="mt-4 pt-4 border-t border-indigo-500/10 flex gap-2">
            <Link
              href={`/stories/${story.id}/edit`}
              className="flex-1 px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-200 rounded-lg text-sm font-medium transition-colors text-center"
            >
              Edit
            </Link>
            <DeleteStoryButton storyId={story.id} onDelete={onDelete} />
          </div>
        )}
      </div>
    </article>
  );
}
