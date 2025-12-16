'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export function Header() {
  const { user, loading, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setShowDropdown(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="py-8 px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="text-4xl group-hover:animate-bounce">🌙</span>
          <div>
            <h1 className="text-2xl font-bold text-white">Bedtime Stories</h1>
            <p className="text-indigo-300/60 text-sm">Sweet dreams await...</p>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          {/* Browse Link - Always visible */}
          <Link
            href="/browse"
            className="px-4 py-2 text-indigo-200 hover:text-white transition-all duration-300 font-medium rounded-full hover:bg-indigo-600/30 border border-transparent hover:border-indigo-500/30"
          >
            Browse Stories
          </Link>

          {loading ? (
            <div className="w-8 h-8 rounded-full bg-indigo-600/30 animate-pulse"></div>
          ) : user ? (
            <>
              <Link
                href="/stories/new"
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-full font-medium transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
              >
                <span>✨</span>
                Write a Story
              </Link>

              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full bg-indigo-600/20 hover:bg-indigo-600/30 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-medium text-sm">
                    {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <span className="text-indigo-200 text-sm hidden sm:block">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                  <svg
                    className={`w-4 h-4 text-indigo-300 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-indigo-900/95 backdrop-blur-sm rounded-xl border border-indigo-500/30 shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-indigo-500/20">
                      <p className="text-white font-medium text-sm truncate">
                        {user.displayName || 'User'}
                      </p>
                      <p className="text-indigo-300/60 text-xs truncate">
                        {user.email}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-300 hover:bg-red-500/20 transition-colors text-sm"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 text-indigo-200 hover:text-white transition-colors font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-full font-medium transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
              >
                <span>✨</span>
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
