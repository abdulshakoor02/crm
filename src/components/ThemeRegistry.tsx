// src/components/ThemeRegistry.tsx
'use client';
import createCache from '@emotion/cache';
import { useServerInsertedHTML } from 'next/navigation';
import { CacheProvider as EmotionCacheProvider } from '@emotion/react';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, GlobalStyles as MuiGlobalStyles } from '@mui/material/styles'; // Import GlobalStyles
import React from 'react';
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext';
import globalStyles from 'src/@core/theme/globalStyles'; // Import the globalStyles function
import themeConfig from 'src/configs/themeConfig'; // Or your actual theme config
import { AuthProvider } from 'src/context/AuthContext';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from 'src/store'; // Your Redux store
import UserLayout from 'src/layouts/UserLayout'; // Your default layout
import WindowWrapper from 'src/@core/components/window-wrapper';
import NProgressWrapper from 'src/components/NProgressWrapper'; // You'll create this
import ReactHotToast from 'src/@core/styles/libs/react-hot-toast';
import { Toaster } from 'react-hot-toast';
import themeOptions from 'src/@core/theme/ThemeOptions'; // Your theme options
import { CacheProvider } from '@emotion/react'; // Corrected import
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache';

// Import your guards - these might need "use client" internally or be wrapped by client components
// For now, assume they can be part of the initial structure
import AclGuard from 'src/@core/components/auth/AclGuard';
import AuthGuard from 'src/@core/components/auth/AuthGuard';
import GuestGuard from 'src/@core/components/auth/GuestGuard';
import Spinner from 'src/@core/components/spinner';
import { defaultACLObj } from 'src/configs/acl';

// Fake DB import - ensure this is safe to run in this context
import 'src/@fake-db';


export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const options = { key: 'mui' };
  const cache = React.useMemo(() => createCache(options), [options]);

  useServerInsertedHTML(() => {
    return (
      <style
        data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(' ')}`}
        dangerouslySetInnerHTML={{
          __html: Object.values(cache.inserted).join(' '),
        }}
      />
    );
  });

  // Placeholder for actual guard logic determination, will be refined later
  // This is a simplified version of what was in _app.tsx's Guard component
  // In a real scenario, this logic would depend on page-specific configurations
  // which are not directly available in the root layout like in _app.tsx.
  // For now, let's assume a default behavior or that this will be handled per-route group.
  const authGuardEnabled = true; // Example: Default to authGuard true
  const guestGuardEnabled = false; // Example: Default to guestGuard false

  // This is a simplified AclAbilities, actual determination might be more complex
  const aclAbilities = defaultACLObj;


  return (
    <CacheProvider value={createEmotionCache()}>
      <ReduxProvider store={store}>
        <AuthProvider>
          <SettingsProvider>
            <SettingsConsumer>
              {({ settings }) => {
                const theme = createTheme(themeOptions(settings, settings.mode || 'light')); // Use settings.mode
                return (
                  <MUIThemeProvider theme={theme}>
                    <CssBaseline />
                    <MuiGlobalStyles styles={globalStyles(theme, settings)} /> {/* Apply global styles */}
                    <WindowWrapper>
                      <NProgressWrapper>
                        {/*
                        The Guard logic from _app.tsx (Component.authGuard, etc.) needs careful consideration.
                        In App Router, this is typically handled by route group layouts or middleware.
                        For this initial step, we'll include a simplified structure.
                        A more robust solution will be part of page migration.
                      */}
                      {/* <Guard authGuard={authGuard} guestGuard={guestGuard}> ... </Guard> */}
                      {/* For now, let's assume UserLayout handles its own guards or we apply a default */}
                      <AuthGuard fallback={<Spinner />}>
                        <UserLayout>
                          {children}
                        </UserLayout>
                      </AuthGuard>
                    </NProgressWrapper>
                    <ReactHotToast>
                      <Toaster position={settings.toastPosition} toastOptions={{ className: 'react-hot-toast' }} />
                    </ReactHotToast>
                  </WindowWrapper>
                </MUIThemeProvider>
              )}
            </SettingsConsumer>
          </SettingsProvider>
        </AuthProvider>
      </ReduxProvider>
    </CacheProvider>
  );
}

// Helper for NProgress (New Component)
// src/components/NProgressWrapper.tsx
// You will need to create this file.
