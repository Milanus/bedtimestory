import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getStoryById } from '@/lib/actions/storyActions';
import { StoryForm } from '@/components/StoryForm';

interface EditStoryPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EditStoryPageProps) {
  const { id } = await params;
  const story = await getStoryById(id);
  
  if (!story) {
    return {
      title: 'Story Not Found | Bedtime Stories',
    };
  }

  return {
    title: `Edit: ${story.title} | Bedtime Stories`,
  };
}

export default async function EditStoryPage({ params }: EditStoryPageProps) {
  const { id } = await params;
  const story = await getStoryById(id);

  if (!story) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900">
      {/* Starry background effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-yellow-200/30 text-2xl animate-pulse">✦</div>
        <div className="absolute top-20 right-20 text-yellow-200/20 text-lg animate-pulse delay-100">✦</div>
        <div className="absolute top-40 left-1/4 text-yellow-200/25 text-sm animate-pulse delay-200">✦</div>
        <div className="absolute bottom-40 right-1/3 text-yellow-200/15 text-xl animate-pulse delay-300">✦</div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="py-8 px-6">
          <div className="max-w-3xl mx-auto">
            <Link
              href={`/stories/${id}`}
              className="inline-flex items-center gap-2 text-indigo-300 hover:text-indigo-200 transition-colors"
            >
              <span>←</span>
              Back to Story
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="py-8 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-5xl mb-4 block">✏️</span>
              <h1 className="text-3xl font-bold text-white mb-2">
                Edit Story
              </h1>
              <p className="text-indigo-200/70">
                Make changes to your magical tale
              </p>
            </div>

            <div className="bg-indigo-900/20 backdrop-blur-sm rounded-2xl p-8 border border-indigo-500/20">
              <StoryForm story={story} mode="edit" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
