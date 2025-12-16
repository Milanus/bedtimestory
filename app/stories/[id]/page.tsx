import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getStoryById } from '@/lib/actions/storyActions';
import LikeButton from '@/components/LikeButton';
import { DeleteStoryButton } from '@/components/DeleteStoryButton';

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900">
      {/* Starry background effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-yellow-200/30 text-2xl animate-pulse">✦</div>
        <div className="absolute top-20 right-20 text-yellow-200/20 text-lg animate-pulse delay-100">✦</div>
        <div className="absolute top-40 left-1/4 text-yellow-200/25 text-sm animate-pulse delay-200">✦</div>
        <div className="absolute bottom-40 right-1/3 text-yellow-200/15 text-xl animate-pulse delay-300">✦</div>
        <div className="absolute bottom-20 left-1/3 text-yellow-200/20 text-lg animate-pulse delay-500">✦</div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="py-8 px-6">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-indigo-300 hover:text-indigo-200 transition-colors"
            >
              <span>←</span>
              Back to Stories
            </Link>
            <div className="flex items-center gap-2">
              <Link
                href={`/stories/${id}/edit`}
                className="px-4 py-2 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 rounded-lg text-sm transition-colors"
              >
                Edit
              </Link>
              <DeleteStoryButton storyId={id} />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="py-8 px-6">
          <article className="max-w-3xl mx-auto">
            {/* Story Header */}
            <div className="text-center mb-8">
              <span className="text-5xl mb-4 block">📖</span>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                {story.title}
              </h1>
              <div className="flex items-center justify-center gap-4 text-indigo-300/60 text-sm">
                <span className="flex items-center gap-1">
                  <span className="text-indigo-400">✍</span>
                  {story.authorName || 'Anonymous'}
                </span>
                <span>•</span>
                <span>{formatDate(story.createdAt)}</span>
              </div>
            </div>

            {/* Story Content */}
            <div className="bg-indigo-900/20 backdrop-blur-sm rounded-2xl p-8 border border-indigo-500/20 mb-8">
              <div className="prose prose-lg prose-invert max-w-none">
                {story.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="text-indigo-100/90 leading-relaxed mb-4 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Story Footer */}
            <div className="flex items-center justify-between">
              <LikeButton
                storyId={story.id}
                userId="anonymous"
                initialLikeCount={story.likeCount}
                initialUserHasLiked={false}
              />
              <div className="text-indigo-300/40 text-sm">
                🌙 Sweet dreams
              </div>
            </div>
          </article>
        </main>
      </div>
    </div>
  );
}
