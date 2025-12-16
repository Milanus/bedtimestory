'use client';

import { User } from '@/types/user';
import { toggleUserAdminStatus } from '@/lib/actions/userActions';
import { useState } from 'react';

interface UserListProps {
  users: User[];
  onUserUpdated: () => void;
}

export function UserList({ users, onUserUpdated }: UserListProps) {
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const handleToggleAdmin = async (userId: string, currentStatus: boolean) => {
    setUpdatingUserId(userId);
    try {
      await toggleUserAdminStatus(userId, !currentStatus);
      onUserUpdated();
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setUpdatingUserId(null);
    }
  };

  return (
    <div className="space-y-3">
      {users.map((user) => (
        <div
          key={user.id}
          className="bg-indigo-900/20 backdrop-blur-sm rounded-xl p-4 border border-indigo-500/20 hover:border-indigo-400/40 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-white font-medium">{user.displayName}</h3>
                {user.isAdmin && (
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30">
                    👑 Admin
                  </span>
                )}
              </div>
              <p className="text-indigo-300/60 text-sm">{user.email}</p>
              <p className="text-indigo-300/40 text-xs mt-1">
                Joined: {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>

            <button
              onClick={() => handleToggleAdmin(user.id, user.isAdmin)}
              disabled={updatingUserId === user.id}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                user.isAdmin
                  ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30'
                  : 'bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/30'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {updatingUserId === user.id ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </span>
              ) : user.isAdmin ? (
                'Remove Admin'
              ) : (
                'Make Admin'
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}