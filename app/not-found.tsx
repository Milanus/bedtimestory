import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center px-6">
      {/* Starry background effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-yellow-200/30 text-2xl animate-pulse">✦</div>
        <div className="absolute top-20 right-20 text-yellow-200/20 text-lg animate-pulse delay-100">✦</div>
        <div className="absolute top-40 left-1/4 text-yellow-200/25 text-sm animate-pulse delay-200">✦</div>
        <div className="absolute bottom-40 right-1/3 text-yellow-200/15 text-xl animate-pulse delay-300">✦</div>
      </div>

      <div className="relative z-10 text-center">
        <span className="text-8xl mb-6 block">🌙</span>
        <h1 className="text-4xl font-bold text-white mb-4">
          Story Not Found
        </h1>
        <p className="text-indigo-200/70 mb-8 max-w-md mx-auto">
          This story seems to have drifted off to dreamland. 
          Let&apos;s find you another magical tale.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-full font-medium transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
        >
          <span>✨</span>
          Back to Stories
        </Link>
      </div>
    </div>
  );
}
