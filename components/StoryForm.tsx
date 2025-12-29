'use client';

import { useState, FormEvent, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createStory, updateStory } from '@/lib/actions/storyActions';
import { uploadStoryImage, uploadStorySound } from '@/lib/firebase-storage';
import { useAuth } from '@/contexts/AuthContext';
import { SerializedStory, STORY_CATEGORIES, StoryCategory } from '@/types/story';

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
  const [description, setDescription] = useState(story?.description || '');
  const [content, setContent] = useState(story?.content || '');
  const [category, setCategory] = useState<StoryCategory>(story?.category || 'adventure');
  const [authorName, setAuthorName] = useState(story?.authorName || '');
  const [youtubeUrl, setYoutubeUrl] = useState(story?.youtubeUrl || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [soundFile, setSoundFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | undefined>(story?.imageUrl);
  const [soundPreview, setSoundPreview] = useState<string | undefined>(story?.soundUrl);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [soundUploadProgress, setSoundUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set author name from user when available
  useEffect(() => {
    if (mode === 'create' && user?.displayName && !authorName) {
      setAuthorName(user.displayName);
    }
  }, [user, mode, authorName]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (20MB)
      if (file.size > 20 * 1024 * 1024) {
        setError('Image file must be less than 20MB');
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSoundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (20MB)
      if (file.size > 20 * 1024 * 1024) {
        setError('Sound file must be less than 20MB');
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('audio/')) {
        setError('Please select an audio file');
        return;
      }

      setSoundFile(file);
      setSoundPreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = story?.imageUrl;
      let soundUrl = story?.soundUrl;

      // Generate temporary ID for new stories (will be replaced with actual ID)
      const tempId = mode === 'edit' ? story!.id : `temp_${Date.now()}`;

      // Upload image if selected
      if (imageFile) {
        imageUrl = await uploadStoryImage(imageFile, tempId, setImageUploadProgress);
      }

      // Upload sound if selected
      if (soundFile) {
        soundUrl = await uploadStorySound(soundFile, tempId, setSoundUploadProgress);
      }

      if (mode === 'edit' && story) {
        const result = await updateStory(story.id, {
          title: title.trim(),
          description: description.trim(),
          content: content.trim(),
        });

        if (result.success) {
          router.push(`/stories/${story.id}`);
          router.refresh();
        } else {
          setError(result.error || 'Failed to update story');
        }
      } else {
        const result = await createStory({
          title: title.trim(),
          description: description.trim(),
          content: content.trim(),
          category,
          authorId: user?.uid || 'anonymous',
          authorName: authorName.trim() || user?.displayName || 'Anonymous',
          imageUrl,
          soundUrl,
          youtubeUrl: youtubeUrl.trim(),
        });

        if (result.success) {
          router.push('/');
          router.refresh();
        } else {
          setError(result.error || 'Failed to create story');
        }
      }
    } catch (err) {
      console.error('Form submission error:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
      setImageUploadProgress(0);
      setSoundUploadProgress(0);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-indigo-200 mb-2">
            Story Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-3 bg-indigo-900/30 border border-indigo-500/30 rounded-lg text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            placeholder="Once upon a time..."
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-indigo-200 mb-2">
            Category
          </label>
          <div className="relative">
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as StoryCategory)}
              required
              className="w-full px-4 py-3 bg-gradient-to-r from-slate-900/50 to-slate-800/50 border border-indigo-500/30 rounded-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent cursor-pointer hover:border-indigo-400/50 transition-colors pr-10"
            >
              {STORY_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.emoji} {cat.label}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-indigo-200 mb-2">
          Short Description (Optional, max 200 characters)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          maxLength={200}
          className="w-full px-4 py-3 bg-indigo-900/30 border border-indigo-500/30 rounded-lg text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none"
          placeholder="A brief description of your story (max 200 characters)..."
        />
        {description && (
          <p className="mt-1 text-xs text-indigo-300/60">
            {description.length}/200 characters
          </p>
        )}
      </div>

      {/* YouTube Link */}
      <div>
        <label htmlFor="youtubeUrl" className="block text-sm font-medium text-indigo-200 mb-2">
          YouTube Link (Optional)
        </label>
        <input
          type="url"
          id="youtubeUrl"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          className="w-full px-4 py-3 bg-indigo-900/30 border border-indigo-500/30 rounded-lg text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
          placeholder="https://www.youtube.com/watch?v=..."
        />
      </div>

      {/* Image Upload */}
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-indigo-200 mb-2">
          Title Image (Optional, max 20MB)
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full px-4 py-3 bg-indigo-900/30 border border-indigo-500/30 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        {imagePreview && (
          <div className="mt-3">
            <img src={imagePreview} alt="Preview" className="max-w-xs rounded-lg border border-indigo-500/20" />
          </div>
        )}
        {imageUploadProgress > 0 && imageUploadProgress < 100 && (
          <div className="mt-2">
            <div className="w-full bg-indigo-900/30 rounded-full h-2">
              <div
                className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${imageUploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-indigo-300 mt-1">Uploading image: {Math.round(imageUploadProgress)}%</p>
          </div>
        )}
      </div>

      {/* Sound Upload */}
      <div>
        <label htmlFor="sound" className="block text-sm font-medium text-indigo-200 mb-2">
          Background Sound (Optional, max 20MB)
        </label>
        <input
          type="file"
          id="sound"
          accept="audio/*"
          onChange={handleSoundChange}
          className="w-full px-4 py-3 bg-indigo-900/30 border border-indigo-500/30 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        {soundPreview && (
          <div className="mt-3">
            <audio controls src={soundPreview} className="w-full max-w-md">
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
        {soundUploadProgress > 0 && soundUploadProgress < 100 && (
          <div className="mt-2">
            <div className="w-full bg-indigo-900/30 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${soundUploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-indigo-300 mt-1">Uploading sound: {Math.round(soundUploadProgress)}%</p>
          </div>
        )}
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-indigo-200 mb-2">
          Story Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={12}
          className="w-full px-4 py-3 bg-indigo-900/30 border border-indigo-500/30 rounded-lg text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none"
          placeholder="Write your magical story here..."
        />
        <p className="text-xs text-indigo-300/60 mt-1">{content.length} characters</p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white rounded-lg font-medium transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            {imageUploadProgress > 0 && imageUploadProgress < 100 ? 'Uploading Image...' :
             soundUploadProgress > 0 && soundUploadProgress < 100 ? 'Uploading Sound...' :
             'Saving...'}
          </span>
        ) : (
          <span>🚀 {mode === 'edit' ? 'Update Story' : 'Publish Story'}</span>
        )}
      </button>
    </form>
  );
}
