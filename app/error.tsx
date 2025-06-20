'use client'; // Error components must be Client Components
import { useEffect } from 'react';
import GlobalErrorContent from './global-error'; // Import the content component

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
         <GlobalErrorContent reset={reset} />
      </body>
    </html>
  );
}
