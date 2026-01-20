'use client';
import { useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useUserStore } from '@/stores/useUserStore';

export default function ClientProvider() {
  const setSession = useUserStore((s) => s.setSession);
  const setProfile = useUserStore((s) => s.setProfile);
  const setInitialized = useUserStore((s) => s.setInitialized);
  const clear = useUserStore((s) => s.clear);
  const setLoading = useUserStore((s) => s.setLoading);
  const setError = useUserStore((s) => s.setError);

  useEffect(() => {
    const supabase = createClient();
    setLoading(true);
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setInitialized();
      if (event === 'SIGNED_OUT') {
        clear(); // clear user store
        return;
      }
      // SIGNED_IN или INITIAL_SESSION → try to fetch user profile
      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session) {
        setSession(session);

        try {
          const res = await fetch('/api/user-profile', { method: 'POST' });
          if (!res.ok) {
            // id 401/403 → delete in user store
            clear();
            setSession(null);
            setError('Unauthorized. Please log in again.');
            return;
          }
          const profile = await res.json();
          setProfile(profile);
        } catch (err) {
          console.error('Error fetching user profile:', err);
          clear();
          setSession(null);
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('Unknown error');
          }
        } finally {
          setLoading(false);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setSession, setProfile, clear, setLoading, setError, setInitialized]);

  return null;
}

// How to use
//const { isLoading, error, profile } = useUserStore();
// if (isLoading) return <SkeletonUserProfile />;
// if (error) return <ErrorBanner message={error} />;
