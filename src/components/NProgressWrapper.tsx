// src/components/NProgressWrapper.tsx
'use client';
import NProgress from 'nprogress';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import themeConfig from 'src/configs/themeConfig';

export default function NProgressWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (themeConfig.routingLoader) {
      NProgress.done();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  useEffect(() => {
    if (themeConfig.routingLoader) {
      NProgress.configure({ showSpinner: false }); // Configure as needed

      // Start NProgress on mount or when route changes start implicitly
      // This is a simplified approach. For more precise control,
      // you might need to listen to custom events if your app emits them
      // during navigations that don't immediately change pathname/searchParams.
      NProgress.start();

      return () => {
        NProgress.done();
      };
    }
  }, []); // Empty dependency array to run once on mount and clean up on unmount


  return <>{children}</>;
}
