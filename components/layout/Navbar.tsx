"use client"; // Keep it client for now if AuthSession or other client hooks are inside

import Link from 'next/link';
import AuthSession from '@/components/AuthSession'; // Re-using the existing AuthSession

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold hover:text-gray-300">
          MyApp
        </Link>
        <div className="space-x-4">
          <Link href="/" className="hover:text-gray-300">Home</Link>
          {/* Add other nav links here e.g.
          <Link href="/dashboard" className="hover:text-gray-300">Dashboard</Link>
          <Link href="/leads" className="hover:text-gray-300">Leads</Link>
          */}
        </div>
        <div>
          <AuthSession /> {/* Displays login/logout status */}
        </div>
      </div>
    </nav>
  );
}
