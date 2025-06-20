'use client';
// ** React Imports
import { useEffect } from 'react';
// ** Next Imports
import { useRouter } from 'next/navigation'; // Changed from next/router
// ** Spinner Import
import Spinner from 'src/@core/components/spinner';
// ** Hook Imports
import { useAuth } from 'src/hooks/useAuth';

export const getHomeRoute = (role: string) => {
  if (role === 'client') return '/acl';
  else return '/home';
};

export default function HomePage() { // Renamed component to avoid conflict if any
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    // router.isReady is not a property in next/navigation, effect runs when router is available
    if (auth.user && auth.user.role) {
      const homeRoute = getHomeRoute(auth.user.role);
      router.replace(homeRoute);
    } else if (auth.user === null) {
      // Explicitly redirect to login if user is null (not loading)
      // This handles the case where user is not logged in.
      // Adjust '/login' if your login path is different.
      router.replace('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.user, router]); // Added router to dependency array as per best practice

  return <Spinner />;
}
