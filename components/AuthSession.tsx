"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export default function AuthSession() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading session...</p>;
  }

  if (session) {
    return (
      <div>
        <p>Signed in as {session.user?.email}</p>
        {session.user?.name && <p>Name: {session.user.name}</p>}
        <button onClick={() => signOut({ callbackUrl: '/login' })}>Sign out</button>
      </div>
    );
  }

  return (
    <div>
      <p>Not signed in</p>
      <Link href="/login">
        <button>Sign in</button>
      </Link>
      {/* Or use the signIn function directly if preferred */}
      {/* <button onClick={() => signIn()}>Sign in</button> */}
    </div>
  );
}
