import type { Metadata } from "next";
import "./globals.css";

// Context/Provider Imports
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import { SettingsProvider } from "src/@core/context/settingsContext";
import { AuthProvider } from "src/context/AuthContext";

// Layout Import
import AppClientLayout from "@/components/layout/AppClientLayout"; // Assuming @ is src/

export const metadata: Metadata = {
  title: "WeCRM Next.js 15",
  description: "CRM application rewritten with Next.js 15 and App Router",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProviderWrapper>
          <AuthProvider>
            <SettingsProvider>
              <AppClientLayout>{children}</AppClientLayout>
            </SettingsProvider>
          </AuthProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
