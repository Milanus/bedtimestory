import { getStoryById } from '@/lib/actions/storyActions';
import { notFound } from 'next/navigation';
import LikeButton from '@/components/LikeButton';
import { STORY_CATEGORIES } from '@/types/story';
import Link from 'next/link';

interface StoryPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: StoryPageProps) {
  const { id } = await params;
  const story = await getStoryById(id);
  
  if (!story) {
    return {
      title: 'Story Not Found | Bedtime Stories',
    };
  }

  return {
    title: `${story.title} | Bedtime Stories`,
    description: story.content.substring(0, 160),
  };
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { id } = await params;
  const story = await getStoryById(id);

  if (!story) {
    notFound();
  }

  const categoryInfo = STORY_CATEGORIES.find(cat => cat.value === story.category) || STORY_CATEGORIES[0];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-indigo-300 hover:text-indigo-200 transition-colors mb-6"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Stories
        </Link>

        {/* Story Card */}
        <article className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-indigo-500/20 shadow-xl">
          {/* Title Image */}
          {story.imageUrl && (
            <div className="relative w-full h-96">
              <img 
                src={story.imageUrl} 
                alt={story.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900 via-indigo-900/50 to-transparent"></div>
              
              {/* Title overlay on image */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="mb-3">
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-500/30 backdrop-blur-sm text-indigo-100 rounded-full text-sm font-medium border border-indigo-400/30">
                    <span>{categoryInfo.emoji}</span>
                    {categoryInfo.label}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                  {story.title}
                </h1>
                <p className="text-indigo-200/90 text-lg drop-shadow">
                  by {story.authorName}
                </p>
              </div>
            </div>
          )}

          <div className="p-8 md:p-12">
            {/* Title without image */}
            {!story.imageUrl && (
              <>
                <div className="mb-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-500/20 text-indigo-200 rounded-full text-sm font-medium">
                    <span>{categoryInfo.emoji}</span>
                    {categoryInfo.label}
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  {story.title}
                </h1>

                <div className="flex items-center justify-between mb-8 pb-6 border-b border-indigo-500/20">
                  <p className="text-indigo-200/70">by {story.authorName}</p>
                  <p className="text-indigo-300/60 text-sm">
                    {formatDate(story.createdAt)}
                  </p>
                </div>
              </>
            )}

            {/* Background Sound Player */}
            {story.soundUrl && (
              <div className="mb-8 p-4 bg-indigo-900/30 rounded-lg border border-indigo-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🎵</span>
                  <h3 className="text-white font-medium">Background Sound</h3>
                </div>
                <audio controls src={story.soundUrl} className="w-full" loop>
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}

            {/* Story Content */}
            <div className="prose prose-invert prose-lg max-w-none mb-8">
              <div className="text-indigo-100/90 leading-relaxed whitespace-pre-wrap">
                {story.content}
              </div>
            </div>

            {/* Like Button */}
            <div className="flex items-center justify-between pt-6 border-t border-indigo-500/20">
              <LikeButton storyId={story.id} initialLikeCount={story.likeCount} />
              
              {story.imageUrl && (
                <p className="text-indigo-300/60 text-sm">
                  {formatDate(story.createdAt)}
                </p>
              )}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
