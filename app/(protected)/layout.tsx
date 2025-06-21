// app/(protected)/layout.tsx
'use client'; // Or remove if UserLayout handles its own client boundary entirely
import UserLayout from 'src/layouts/UserLayout';

export default function ProtectedRoutesLayout({ children }: { children: React.ReactNode }) {
  // AuthGuard is already applied higher up in ThemeRegistry around UserLayout
  return <UserLayout>{children}</UserLayout>;
}
