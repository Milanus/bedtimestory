'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { StoryList } from './StoryList';
import { UserList } from './UserList';
import { SerializedStory } from '@/types/story';
import { User } from '@/types/user';
import { getStories, getStoriesByAuthor, getStoryById } from '@/lib/actions/storyActions';
import { checkIfUserIsAdmin, getAllUsers } from '@/lib/actions/userActions';
import { getLikesByUser } from '@/lib/actions/likeActions';

export function DashboardContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stories, setStories] = useState<SerializedStory[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [favorites, setFavorites] = useState<SerializedStory[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [activeTab, setActiveTab] = useState<'stories' | 'users' | 'favorites'>('stories');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      loadDashboardData();
    }
  }, [user, loading, router]);

  const loadDashboardData = async () => {
    if (!user) return;

    setIsLoadingData(true);
    try {
      // Check if user is admin
      const adminStatus = await checkIfUserIsAdmin(user.uid);
      setIsAdmin(adminStatus);

      // Load stories based on admin status
      if (adminStatus) {
        const allStories = await getStories();
        setStories(allStories);
        
        // Load all users for admin
        const allUsers = await getAllUsers();
        setUsers(allUsers);
      } else {
        const userStories = await getStoriesByAuthor(user.uid);
        setStories(userStories);
      }

      // Load favorite stories for all users
      console.log('[Dashboard] Fetching likes for user:', user.uid);
      const userLikes = await getLikesByUser(user.uid);
      console.log('[Dashboard] User likes:', userLikes);
      console.log('[Dashboard] Number of likes:', userLikes.length);
      
      const favoriteStories = await Promise.all(
        userLikes.map(async (like) => {
          console.log('[Dashboard] Fetching story for ID:', like.storyId);
          const story = await getStoryById(like.storyId);
          console.log('[Dashboard] Story fetched:', story ? `${story.title} (${story.id})` : 'null');
          return story;
        })
      );
      console.log('[Dashboard] Total favorite stories fetched:', favoriteStories.length);
      console.log('[Dashboard] Non-null stories:', favoriteStories.filter(s => s !== null).length);
      
      setFavorites(favoriteStories.filter((story): story is SerializedStory => story !== null));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  if (loading || isLoadingData) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-indigo-200/70">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {isAdmin ? '🔐 Admin Dashboard' : '📚 My Stories'}
            </h1>
            <p className="text-indigo-200/70">
              {isAdmin
                ? 'Manage all stories and users across the platform'
                : `Welcome back, ${user.displayName || user.email}`}
            </p>
          </div>
          {isAdmin && (
            <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium rounded-full">
              Admin Access
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-indigo-900/20 backdrop-blur-sm rounded-xl p-4 border border-indigo-500/20">
            <div className="text-indigo-300/60 text-sm mb-1">
              {isAdmin ? 'Total Stories' : 'Your Stories'}
            </div>
            <div className="text-2xl font-bold text-white">{stories.length}</div>
          </div>
          <div className="bg-indigo-900/20 backdrop-blur-sm rounded-xl p-4 border border-indigo-500/20">
            <div className="text-indigo-300/60 text-sm mb-1">
              {isAdmin ? 'Total Users' : 'Total Likes'}
            </div>
            <div className="text-2xl font-bold text-white">
              {isAdmin ? users.length : stories.reduce((sum, story) => sum + story.likeCount, 0)}
            </div>
          </div>
          <div className="bg-indigo-900/20 backdrop-blur-sm rounded-xl p-4 border border-indigo-500/20">
            <div className="text-indigo-300/60 text-sm mb-1">Status</div>
            <div className="text-2xl font-bold text-white">{isAdmin ? 'Admin' : 'Author'}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-indigo-500/20">
        <button
          onClick={() => setActiveTab('stories')}
          className={`px-6 py-3 font-bold transition-all rounded-t-lg ${
            activeTab === 'stories'
              ? 'text-white border-b-2 border-indigo-400 bg-indigo-900/30'
              : 'text-indigo-200 hover:text-white bg-indigo-900/10 hover:bg-indigo-900/20'
          }`}
        >
          📚 {isAdmin ? 'Stories' : 'My Stories'} ({stories.length})
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`px-6 py-3 font-bold transition-all rounded-t-lg ${
            activeTab === 'favorites'
              ? 'text-white border-b-2 border-indigo-400 bg-indigo-900/30'
              : 'text-indigo-200 hover:text-white bg-indigo-900/10 hover:bg-indigo-900/20'
          }`}
        >
          ❤️ Favorites ({favorites.length})
        </button>
        {isAdmin && (
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-bold transition-all rounded-t-lg ${
              activeTab === 'users'
                ? 'text-white border-b-2 border-indigo-400 bg-indigo-900/30'
                : 'text-indigo-200 hover:text-white bg-indigo-900/10 hover:bg-indigo-900/20'
            }`}
          >
            👥 Users ({users.length})
          </button>
        )}
      </div>

      {/* Content */}
      <div>
        {activeTab === 'stories' ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                {isAdmin ? 'All Platform Stories' : 'Your Published Stories'}
              </h2>
            </div>

            {stories.length === 0 ? (
              <div className="text-center py-20 bg-indigo-900/10 rounded-2xl border border-indigo-500/10">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-indigo-200 mb-2">
                  No stories yet
                </h3>
                <p className="text-indigo-300/60 mb-6">
                  {isAdmin
                    ? 'No stories have been published on the platform yet.'
                    : "You haven't written any stories yet. Start sharing your magical tales!"}
                </p>
                {!isAdmin && (
                  <button
                    onClick={() => router.push('/stories/new')}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg font-medium transition-all"
                  >
                    Write Your First Story
                  </button>
                )}
              </div>
            ) : (
              <StoryList stories={stories} showActions={true} />
            )}
          </>
        ) : activeTab === 'favorites' ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                Your Favorite Stories
              </h2>
            </div>

            {favorites.length === 0 ? (
              <div className="text-center py-20 bg-indigo-900/10 rounded-2xl border border-indigo-500/10">
                <div className="text-6xl mb-4">❤️</div>
                <h3 className="text-xl font-semibold text-indigo-200 mb-2">
                  No favorites yet
                </h3>
                <p className="text-indigo-300/60 mb-6">
                  Stories you like will appear here. Start exploring and save your favorites!
                </p>
                <button
                  onClick={() => router.push('/browse')}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg font-medium transition-all"
                >
                  Browse Stories
                </button>
              </div>
            ) : (
              <StoryList stories={favorites} showActions={false} />
            )}
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                Platform Users
              </h2>
            </div>

            {users.length === 0 ? (
              <div className="text-center py-20 bg-indigo-900/10 rounded-2xl border border-indigo-500/10">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-xl font-semibold text-indigo-200 mb-2">
                  No users yet
                </h3>
                <p className="text-indigo-300/60">
                  No users have registered on the platform yet.
                </p>
              </div>
            ) : (
              <UserList users={users} onUserUpdated={loadDashboardData} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
