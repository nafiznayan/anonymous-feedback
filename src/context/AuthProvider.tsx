"use client";

import { SessionProvider } from "next-auth/react";

/**
 * AuthProvider Component
 *
 * This component wraps the application with NextAuth's SessionProvider.
 * It allows any child component to access the authentication session
 * using hooks like `useSession()`.
 */
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode; // `children` represents any React components nested inside this provider
}) {
  return (
    // SessionProvider gives access to session data (e.g., user info, token) globally
    <SessionProvider>
      {children} {/* Render all nested components within this provider */}
    </SessionProvider>
  );
}
