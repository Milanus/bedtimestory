import { getStories } from '@/lib/actions/storyActions';
import { StoryList } from '@/components/StoryList';
import { Header } from '@/components/Header';

export default async function Home() {
  const stories = await getStories();

  return (
    <div className="min-h-screen">
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
        {/* Header with Auth */}
        <Header />

        {/* Hero Section */}
        <section className="py-12 px-6 text-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Magical Stories for
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                {' '}Peaceful Nights
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-white max-w-xl mx-auto leading-relaxed font-bold" style={{ WebkitTextStroke: '1px rgba(0,0,0,0.5)' }}>
              Discover enchanting bedtime stories shared by dreamers around the world. 
              Read, share, and drift off to sleep with tales of wonder.
            </p>
          </div>
        </section>

        {/* Stories Section */}
        <main className="py-8 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <span>📚</span>
                Latest Stories
              </h3>
              <span className="text-indigo-300/60 text-sm">
                {stories.length} {stories.length === 1 ? 'story' : 'stories'}
              </span>
            </div>
            
            <StoryList stories={stories} />
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
