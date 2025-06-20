// app/layout.tsx
import '../../styles/globals.css';
import 'prismjs/themes/prism-tomorrow.css';
import 'react-perfect-scrollbar/dist/css/styles.css';
import 'prismjs';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';

import ThemeRegistry from 'src/components/ThemeRegistry'; // Adjust path if needed

export const metadata = {
  title: 'WeCRM', // Default title from _app.tsx
  description: 'Material Design React Admin Dashboard Template – is the most developer friendly & highly customizable Admin Dashboard Template based on MUI v5.',
  keywords: 'Material Design, MUI, Admin Template, React Admin Template',
  // viewport: 'initial-scale=1, width=device-width' // Next.js handles viewport by default
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
        />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png" />
        <link rel="shortcut icon" href="/images/wethink.jpeg" />
      </head>
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
