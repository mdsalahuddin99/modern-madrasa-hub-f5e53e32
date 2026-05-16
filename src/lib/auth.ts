import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import prisma from "./prisma";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    ...authConfig.providers.filter(p => p.id !== 'credentials'),
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: {
            subscriptions: {
              where: { status: "ACTIVE" },
              orderBy: { endDate: "desc" },
              take: 1,
            },
          },
        });

        if (!user || !user.hashedPassword) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.hashedPassword
        );

        if (!isValid) return null;

        const activeSubscription = user.subscriptions[0];
        const subscriptionEndDate = activeSubscription?.endDate ? activeSubscription.endDate.toISOString() : null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          subscriptionActive: user.subscriptionActive,
          subscriptionEndDate,
          wizardCompleted: user.wizardCompleted,
        };
      },
    }),
  ],
});
