import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { checkIfUserIsAdmin } from '@/lib/firebase-admin';

/**
 * React hook to check if current user is an admin
 * @returns {object} - Object containing isAdmin status and loading state
 * 
 * @example
 * ```typescript
 * function AdminPanel() {
 *   const { isAdmin, loading } = useAdmin();
 * 
 *   if (loading) return <div>Loading...</div>;
 *   if (!isAdmin) return <div>Access denied</div>;
 * 
 *   return <div>Admin Panel Content</div>;
 * }
 * ```
 */
export function useAdmin() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    async function checkAdminStatus() {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const adminStatus = await checkIfUserIsAdmin(user.uid);
        if (mounted) {
          setIsAdmin(adminStatus);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        if (mounted) {
          setIsAdmin(false);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    checkAdminStatus();

    return () => {
      mounted = false;
    };
  }, [user]);

  return { isAdmin, loading };
}

/**
 * Higher-order component wrapper for admin-only components
 * @param Component - Component to wrap
 * @param FallbackComponent - Component to show if not admin (optional)
 * 
 * @example
 * ```typescript
 * const AdminComponent = withAdminAuth(MyComponent);
 * ```
 */
export function withAdminAuth<P extends object>(
  Component: React.ComponentType<P>,
  FallbackComponent?: React.ComponentType
) {
  return function WrappedComponent(props: P) {
    const { isAdmin, loading } = useAdmin();

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!isAdmin) {
      if (FallbackComponent) {
        return <FallbackComponent />;
      }
      return <div>Access denied. Admin privileges required.</div>;
    }

    return <Component {...props} />;
  };
}

/**
 * React hook to get current user's complete profile data
 * @returns {object} - Object containing user profile data
 * 
 * @example
 * ```typescript
 * function UserProfile() {
 *   const { profile, loading } = useUserProfile();
 * 
 *   if (loading) return <div>Loading...</div>;
 *   if (!profile) return <div>No profile found</div>;
 *
 *   return (
 *     <div>
 *       <h2>{profile.displayName}</h2>
 *       <p>{profile.email}</p>
 *       {profile.isAdmin && <span>Admin</span>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useUserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    async function fetchProfile() {
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        const { getUserData } = await import('@/lib/firebase-admin');
        const userData = await getUserData(user.uid);
        if (mounted) {
          setProfile(userData);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        if (mounted) {
          setProfile(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchProfile();

    return () => {
      mounted = false;
    };
  }, [user]);

  return { profile, loading };
}
