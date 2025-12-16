import { getStories, getStoriesByAuthor } from '@/lib/actions/storyActions';
import { Header } from '@/components/Header';
import { DashboardContent } from '@/components/DashboardContent';
import { getUserData } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';

export const metadata = {
  title: 'Dashboard | Bedtime Stories',
  description: 'Manage your bedtime stories',
};

async function getCurrentUserId() {
  // This is a simplified version - you'd need to implement proper auth checking
  // For now, we'll return null and handle it on the client side
  return null;
}

export default async function DashboardPage() {
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

        {/* Main Content */}
        <main className="py-8 px-6">
          <div className="max-w-7xl mx-auto">
            <DashboardContent />
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
