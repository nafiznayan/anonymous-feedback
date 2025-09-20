import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

/**
 * NextAuth configuration for handling authentication in the app.
 * This configuration uses a credentials-based provider (email/username + password).
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      // Fields expected from the sign-in form
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      /**
       * This function runs when a user attempts to sign in.
       * It handles user validation by checking:
       * 1. If the user exists (by email or username)
       * 2. If the user's email is verified
       * 3. If the provided password matches the stored hashed password
       */
      async authorize(credentials: any): Promise<any> {
        await dbConnect(); // Ensure database connection before querying

        try {
          // Find user by either email or username
          const user = await UserModel.findOne({
            $or: [
              { email: credentials?.identifier },
              { username: credentials?.identifier },
            ],
          });

          // If user doesn't exist, throw error
          if (!user) {
            throw new Error("No user found with this email or username");
          }

          // Prevent login if the email is not verified
          if (!user.isVerified) {
            throw new Error("Please verify your email to login");
          }

          // Compare the provided password with the hashed password stored in DB
          const isValid = await bcrypt.compare(
            credentials?.password,
            user.password
          );

          if (isValid) {
            // If password matches, return the user object
            return user;
          } else {
            throw new Error("Invalid password");
          }
        } catch (error) {
          // Log the error and return a generic authorization failure
          console.error("Error in authorize:", error);
          throw new Error("Authorization failed");
        }
      },
    }),
  ],

  /**
   * Callbacks are functions that run at different points of the authentication flow.
   */
  callbacks: {
    /**
     * `jwt` callback:
     * Runs whenever a new JWT token is created or updated.
     * Here we are adding custom fields to the token for session use.
     */
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token;
    },

    /**
     * `session` callback:
     * Runs whenever a session is checked or created.
     * Here we add extra user data from the JWT to the session object.
     */
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    },
  },

  /**
   * Custom pages for authentication flow
   * - Overrides the default NextAuth sign-in page with our own custom page.
   */
  pages: {
    signIn: "/sign-in",
  },

  /**
   * Use JWT strategy instead of default database sessions
   * - Makes it stateless and better for API-based auth.
   */
  session: {
    strategy: "jwt",
  },

  /**
   * Secret key for signing and encrypting JWT tokens.
   * Should be set in the environment variables for security.
   */
  secret: process.env.NEXTAUTH_SECRET,
};
