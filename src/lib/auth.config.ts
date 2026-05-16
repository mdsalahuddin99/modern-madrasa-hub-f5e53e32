import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        // authorize logic will be in auth.ts as it needs Prisma/Bcrypt
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.subscriptionActive = (user as any).subscriptionActive;
        token.subscriptionEndDate = (user as any).subscriptionEndDate || null;
        token.wizardCompleted = (user as any).wizardCompleted;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.subscriptionActive = token.subscriptionActive as boolean;
        session.user.subscriptionEndDate = token.subscriptionEndDate as string | null;
        session.user.wizardCompleted = token.wizardCompleted as boolean;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
