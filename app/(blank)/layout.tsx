// app/(blank)/layout.tsx
'use client';
import BlankLayout from 'src/@core/layouts/BlankLayout';
import GuestGuard from 'src/@core/components/auth/GuestGuard';
import Spinner from 'src/@core/components/spinner';
import NProgressWrapper from 'src/components/NProgressWrapper'; // Assuming NProgress should run here too

// This layout will wrap pages like login, register, forgot-password
export default function AuthPagesLayout({ children }: { children: React.ReactNode }) {
  return (
    // NProgressWrapper might be beneficial here if not caught by the root layout's ThemeRegistry one
    // Or if ThemeRegistry's NProgress is tied to UserLayout components only.
    // For simplicity, let's assume root NProgressWrapper is sufficient for now or add it if needed.
    <NProgressWrapper>
        <GuestGuard fallback={<Spinner />}>
          <BlankLayout>{children}</BlankLayout>
        </GuestGuard>
    </NProgressWrapper>
  );
}
