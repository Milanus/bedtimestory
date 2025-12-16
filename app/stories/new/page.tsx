import Link from 'next/link';
import { StoryForm } from '@/components/StoryForm';

export const metadata = {
  title: 'Write a New Story | Bedtime Stories',
  description: 'Share your magical bedtime story with the world',
};

export default function NewStoryPage() {
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
        <header className="py-6 px-6">
          <div className="max-w-2xl mx-auto">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-indigo-300 hover:text-white transition-colors"
            >
              ← Back to Stories
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="py-8 px-6 pb-16">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                Write a New Story
              </h1>
              <p className="text-indigo-200/60">
                Share your magical tale with dreamers everywhere
              </p>
            </div>

            {/* Form */}
            <div className="bg-slate-800/30 rounded-2xl p-6 md:p-8 border border-indigo-500/10">
              <StoryForm mode="create" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
