// This file extends NextAuth's default TypeScript types to include custom fields that you added to your authentication flow.

// By default, NextAuth provides basic fields like user.email, user.name, and user.image.
// However, if you have added custom fields (e.g., user._id, user.isVerified, etc.), you need to inform TypeScript about these additions.

import "next-auth";

declare module "next-auth" {
  interface User {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    username?: string;
  }
  interface Session {
    user: {
      _id?: string;
      isVerified?: boolean;
      isAcceptingMessages?: boolean;
      username?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    username?: string;
  }
}
