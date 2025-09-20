import NextAuth from "next-auth";
import { authOptions } from "./options";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// import NextAuth from "next-auth";
// import { authOptions } from "./options";

// /**
//  * This file defines the API route handler for authentication
//  * using NextAuth in a Next.js app with the App Router.
//  *
//  * It uses the `authOptions` configuration defined in the `options.ts` file.
//  */
// const handler = NextAuth(authOptions);

// /**
//  * NextAuth needs to support both GET and POST requests:
//  * - GET: Used for retrieving the session or authorization pages.
//  * - POST: Used for sign-in, sign-out, and token refresh actions.
//  *
//  * By exporting `handler` as both GET and POST,
//  * we ensure NextAuth correctly handles all necessary authentication flows.
//  */
// export { handler as GET, handler as POST };
