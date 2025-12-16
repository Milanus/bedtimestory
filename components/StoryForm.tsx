'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createStory, updateStory } from '@/lib/actions/storyActions';
import { SerializedStory, STORY_CATEGORIES, StoryCategory } from '@/types/story';
import { useAuth } from '@/contexts/AuthContext';

interface StoryFormProps {
  story?: SerializedStory;
  mode: 'create' | 'edit';
}

export function StoryForm({ story, mode }: StoryFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(story?.title || '');
  const [content, setContent] = useState(story?.content || '');
  const [category, setCategory] = useState<StoryCategory>(story?.category || 'adventure');
  const [authorName, setAuthorName] = useState(story?.authorName || '');

  // Set author name from user when available
  useEffect(() => {
    if (mode === 'create' && user?.displayName && !authorName) {
      setAuthorName(user.displayName);
    }
  }, [user, mode, authorName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    startTransition(async () => {
      try {
        if (mode === 'create') {
          const result = await createStory({
            title: title.trim(),
            content: content.trim(),
            category,
            authorId: user?.uid || 'anonymous',
            authorName: authorName.trim() || user?.displayName || 'Anonymous',
          });

          if (result.success) {
            router.push('/');
            router.refresh();
          } else {
            setError(result.error || 'Failed to create story');
          }
        } else if (story) {
          const result = await updateStory(story.id, {
            title: title.trim(),
            content: content.trim(),
          });

          if (result.success) {
            router.push(`/stories/${story.id}`);
            router.refresh();
          } else {
            setError(result.error || 'Failed to update story');
          }
        }
      } catch (err) {
        console.error('Form submission error:', err);
        setError('An unexpected error occurred');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/20 border border-red-500/40 text-red-200 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Author & Category */}
      <div className="grid sm:grid-cols-2 gap-4">
        {mode === 'create' && (
          <div>
            <label
              htmlFor="authorName"
              className="block text-sm font-medium text-indigo-200 mb-2"
            >
              Author Name
            </label>
            <input
              type="text"
              id="authorName"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder={user?.displayName || 'Anonymous'}
              className="w-full px-4 py-3 bg-slate-900/50 border border-indigo-500/20 rounded-lg text-white placeholder-indigo-400/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
        )}

        <div className={mode === 'create' ? '' : 'sm:col-span-2'}>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-indigo-200 mb-2"
          >
            Category <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as StoryCategory)}
              className="w-full px-4 py-3 bg-gradient-to-r from-slate-900/50 to-slate-800/50 border border-indigo-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400/50 transition-all appearance-none cursor-pointer hover:border-indigo-400/50 pr-10"
            >
              {STORY_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value} className="bg-slate-900 py-2">
                  {cat.emoji} {cat.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-indigo-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-indigo-200 mb-2"
        >
          Story Title <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Once upon a time..."
          required
          className="w-full px-4 py-3 bg-slate-900/50 border border-indigo-500/20 rounded-lg text-white placeholder-indigo-400/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Content */}
      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-indigo-200 mb-2"
        >
          Story Content <span className="text-red-400">*</span>
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your magical bedtime story here..."
          required
          rows={12}
          className="w-full px-4 py-3 bg-slate-900/50 border border-indigo-500/20 rounded-lg text-white placeholder-indigo-400/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-slate-200 rounded-lg font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <span className="animate-spin">✦</span>
              {mode === 'create' ? 'Creating...' : 'Saving...'}
            </>
          ) : (
            mode === 'create' ? 'Publish Story' : 'Save Changes'
          )}
        </button>
      </div>
    </form>
  );
}
