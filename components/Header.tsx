'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect, useRef } from 'react';

export function Header() {
  const { user, loading, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showMobileMenu]);

  const handleLogout = async () => {
    try {
      await logout();
      setShowDropdown(false);
      setShowMobileMenu(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="sticky top-0 z-40 py-3 md:py-5 px-4 md:px-8 bg-gradient-to-r from-purple-900/80 via-indigo-900/80 to-purple-900/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-purple-900/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 md:gap-3 group">
          <div className="relative">
            <span className="text-3xl md:text-4xl group-hover:animate-bounce transition-transform">🌙</span>
            <div className="absolute -inset-1 bg-yellow-400/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent">
              Bedtime Stories
            </h1>
            <p className="text-indigo-300/50 text-xs md:text-sm hidden sm:block tracking-wide">
              Sweet dreams await...
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {/* Navigation Links */}
          <Link
            href="/browse"
            className="group relative px-4 py-2 text-indigo-200 hover:text-white transition-all duration-300 font-medium text-lg"
          >
            <span className="relative z-10">Browse Stories</span>
            <div className="absolute inset-0 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-400 group-hover:w-3/4 transition-all duration-300"></div>
          </Link>

          {user && (
            <Link
              href="/dashboard"
              className="group relative px-4 py-2 text-indigo-200 hover:text-white transition-all duration-300 font-medium text-lg"
            >
              <span className="relative z-10">Dashboard</span>
              <div className="absolute inset-0 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-400 group-hover:w-3/4 transition-all duration-300"></div>
            </Link>
          )}

          {/* Divider */}
          <div className="w-px h-6 bg-white/10 mx-2"></div>

          {loading ? (
            <div className="w-9 h-9 rounded-full bg-white/10 animate-pulse"></div>
          ) : user ? (
            <div className="flex items-center gap-3">
              {/* Write Story Button */}
              <Link
                href="/stories/new"
                className="group relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white rounded-full font-medium text-lg transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105"
              >
                <span className="group-hover:rotate-12 transition-transform">✨</span>
                <span>Write Story</span>
              </Link>

              {/* User Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 p-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold text-sm shadow-inner">
                    {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <svg
                    className={`w-4 h-4 text-indigo-300 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-gradient-to-b from-indigo-900/98 to-purple-900/98 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl shadow-purple-900/50 py-2 overflow-hidden">
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-white font-semibold text-sm truncate">
                        {user.displayName || 'User'}
                      </p>
                      <p className="text-indigo-300/60 text-xs truncate mt-0.5">
                        {user.email}
                      </p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/dashboard"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-indigo-200 hover:text-white hover:bg-white/5 transition-colors text-sm"
                      >
                        <span>📊</span>
                        <span>My Dashboard</span>
                      </Link>
                      <Link
                        href="/stories/new"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-indigo-200 hover:text-white hover:bg-white/5 transition-colors text-sm"
                      >
                        <span>✨</span>
                        <span>Write Story</span>
                      </Link>
                    </div>
                    <div className="border-t border-white/10 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-sm"
                      >
                        <span>🚪</span>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-indigo-200 hover:text-white transition-colors font-medium text-base hover:bg-white/5 rounded-lg"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="group relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white rounded-full font-medium text-base transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105"
              >
                <span className="group-hover:rotate-12 transition-transform">✨</span>
                <span>Get Started</span>
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300"
          aria-label="Toggle menu"
        >
          <div className="w-5 h-4 flex flex-col justify-between">
            <span className={`block h-0.5 bg-white rounded-full transition-all duration-300 ${showMobileMenu ? 'rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`block h-0.5 bg-white rounded-full transition-all duration-300 ${showMobileMenu ? 'opacity-0 scale-0' : ''}`}></span>
            <span className={`block h-0.5 bg-white rounded-full transition-all duration-300 ${showMobileMenu ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden transition-opacity duration-300 ${showMobileMenu ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setShowMobileMenu(false)}
      />

      {/* Mobile Menu Panel */}
      <div 
        className={`fixed top-0 right-0 w-[85%] max-w-[320px] bg-[#1e1b4b] z-50 md:hidden transition-transform duration-300 ease-out shadow-2xl border-l border-purple-800/50 ${showMobileMenu ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-5 border-b border-purple-700/50">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌙</span>
              <span className="text-white font-semibold">Menu</span>
            </div>
            <button
              onClick={() => setShowMobileMenu(false)}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-purple-800/50 hover:bg-purple-700/50 transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* User Info (if logged in) */}
          {user && (
            <div className="p-5 bg-purple-900/50 border-b border-purple-700/50">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold truncate">
                    {user.displayName || 'User'}
                  </p>
                  <p className="text-indigo-300/60 text-sm truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="p-4 space-y-2">
            <Link
              href="/browse"
              onClick={() => setShowMobileMenu(false)}
              className="flex items-center gap-4 px-4 py-4 text-white hover:bg-white/10 rounded-2xl transition-all duration-200 active:scale-98"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                <span className="text-xl">📚</span>
              </div>
              <span className="font-medium">Browse Stories</span>
            </Link>

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center gap-4 px-4 py-4 text-white hover:bg-white/10 rounded-2xl transition-all duration-200 active:scale-98"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                    <span className="text-xl">📊</span>
                  </div>
                  <span className="font-medium">Dashboard</span>
                </Link>

                <Link
                  href="/stories/new"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center gap-4 px-4 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl font-medium shadow-lg shadow-purple-500/25 transition-all duration-200 active:scale-98"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <span className="text-xl">✨</span>
                  </div>
                  <span>Write a Story</span>
                </Link>
              </>
            ) : !loading && (
              <>
                <Link
                  href="/login"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center gap-4 px-4 py-4 text-white hover:bg-white/10 rounded-2xl transition-all duration-200 active:scale-98"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                    <span className="text-xl">🔐</span>
                  </div>
                  <span className="font-medium">Sign In</span>
                </Link>

                <Link
                  href="/register"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center gap-4 px-4 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl font-medium shadow-lg shadow-purple-500/25 transition-all duration-200 active:scale-98"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <span className="text-xl">✨</span>
                  </div>
                  <span>Get Started</span>
                </Link>
              </>
            )}
          </nav>

          {/* Logout Button */}
          {user && (
            <div className="p-4 border-t border-purple-700/50">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-4 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <span className="text-xl">🚪</span>
                </div>
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
