'use client';

import { useState } from 'react';
import { SerializedStory, STORY_CATEGORIES } from '@/types/story';
import { StoryCard } from './StoryCard';

interface BrowseStoriesContentProps {
  stories: SerializedStory[];
  categories: typeof STORY_CATEGORIES;
}

export function BrowseStoriesContent({ stories, categories }: BrowseStoriesContentProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredStories = selectedCategory
    ? stories.filter((story) => story.category === selectedCategory)
    : stories;

  const getCategoryCount = (categoryValue: string) => {
    return stories.filter((story) => story.category === categoryValue).length;
  };

  return (
    <div className="space-y-10">
      {/* Category Filter Section */}
      <div className="bg-indigo-900/20 backdrop-blur-sm rounded-2xl p-6 border border-indigo-500/10">
        <h3 className="text-sm font-medium text-indigo-300 uppercase tracking-wider mb-4 text-center">
          Filter by Category
        </h3>
        <div className="flex flex-wrap gap-2 justify-center">
          {/* All Stories Button */}
          <button
            onClick={() => setSelectedCategory(null)}
            className={`group flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${
              selectedCategory === null
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30 scale-105'
                : 'bg-slate-800/50 text-indigo-200 hover:bg-slate-700/50 border border-indigo-500/20 hover:border-indigo-400/40 hover:scale-102'
            }`}
          >
            All
            <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${
              selectedCategory === null 
                ? 'bg-white/20' 
                : 'bg-indigo-500/20 group-hover:bg-indigo-500/30'
            }`}>
              {stories.length}
            </span>
          </button>

          {/* Category Buttons */}
          {categories.map((category) => {
            const count = getCategoryCount(category.value);
            const isSelected = selectedCategory === category.value;
            return (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`group flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30 scale-105'
                    : 'bg-slate-800/50 text-indigo-200 hover:bg-slate-700/50 border border-indigo-500/20 hover:border-indigo-400/40 hover:scale-102'
                }`}
              >
                <span className="text-base">{category.emoji}</span>
                <span className="hidden sm:inline">{category.label}</span>
                <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${
                  isSelected 
                    ? 'bg-white/20' 
                    : 'bg-indigo-500/20 group-hover:bg-indigo-500/30'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Section */}
      <div>
        {/* Results Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-indigo-500/20">
          <h3 className="text-2xl font-bold text-white flex items-center gap-3">
            {selectedCategory ? (
              <>
                <span className="text-3xl">
                  {categories.find((c) => c.value === selectedCategory)?.emoji}
                </span>
                <span>
                  {categories.find((c) => c.value === selectedCategory)?.label}
                  <span className="text-indigo-300 font-normal"> Stories</span>
                </span>
              </>
            ) : (
              <>
                <span className="text-3xl">✨</span>
                <span>
                  All<span className="text-indigo-300 font-normal"> Stories</span>
                </span>
              </>
            )}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-indigo-300/80 text-sm font-medium bg-indigo-500/10 px-4 py-2 rounded-full">
              {filteredStories.length} {filteredStories.length === 1 ? 'story' : 'stories'} found
            </span>
          </div>
        </div>

        {/* Stories Grid */}
        {filteredStories.length === 0 ? (
          <div className="text-center py-20 bg-indigo-900/10 rounded-2xl border border-indigo-500/10">
            <div className="text-7xl mb-6">🌙</div>
            <h3 className="text-2xl font-semibold text-indigo-100 mb-3">
              No stories in this category yet
            </h3>
            <p className="text-indigo-300/60 text-lg max-w-md mx-auto">
              Be the first to share a magical story in the{' '}
              <span className="text-indigo-200 font-medium">
                {categories.find((c) => c.value === selectedCategory)?.label}
              </span>{' '}
              category!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredStories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
