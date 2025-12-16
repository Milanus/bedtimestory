import { getStories } from '@/lib/actions/storyActions';
import { Header } from '@/components/Header';
import { STORY_CATEGORIES } from '@/types/story';
import { BrowseStoriesContent } from '@/components/BrowseStoriesContent';

export default async function BrowsePage() {
  const stories = await getStories();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900">
      {/* Starry background effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-yellow-200/30 text-2xl animate-pulse">✦</div>
        <div className="absolute top-20 right-20 text-yellow-200/20 text-lg animate-pulse delay-100">✦</div>
        <div className="absolute top-40 left-1/4 text-yellow-200/25 text-sm animate-pulse delay-200">✦</div>
        <div className="absolute top-32 right-1/3 text-yellow-200/15 text-xl animate-pulse delay-300">✦</div>
        <div className="absolute top-60 left-1/2 text-yellow-200/20 text-xs animate-pulse delay-500">✦</div>
        <div className="absolute bottom-40 left-20 text-yellow-200/25 text-lg animate-pulse delay-700">✦</div>
        <div className="absolute bottom-60 right-40 text-yellow-200/30 text-sm animate-pulse delay-1000">✦</div>
      </div>

      <div className="relative z-10">
        <Header />

        {/* Hero Section */}
        <section className="py-12 px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <span className="inline-block px-4 py-1.5 bg-indigo-500/20 text-indigo-300 rounded-full text-sm font-medium mb-4 border border-indigo-500/20">
              Discover Magic
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Browse Stories by
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {' '}Category
              </span>
            </h2>
            <p className="text-lg text-indigo-200/70 max-w-xl mx-auto leading-relaxed">
              Find the perfect bedtime story by exploring our magical categories. 
              Each tale awaits to whisk you away to dreamland.
            </p>
          </div>
        </section>

        {/* Browse Content */}
        <main className="py-8 px-6">
          <div className="max-w-7xl mx-auto">
            <BrowseStoriesContent 
              stories={stories} 
              categories={STORY_CATEGORIES} 
            />
          </div>
        </main>

        {/* Footer */}
        <footer className="py-8 px-6 mt-12 border-t border-indigo-500/20">
          <div className="max-w-6xl mx-auto text-center text-indigo-300/50 text-sm">
            <p>Made with 💜 for sweet dreams everywhere</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
