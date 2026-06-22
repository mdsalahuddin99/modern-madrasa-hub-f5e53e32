// ===================================================
// NextAuth Type Extensions
// ===================================================

import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      subscriptionActive: boolean;
      subscriptionEndDate: string | null;
      wizardCompleted: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    subscriptionActive: boolean;
    subscriptionEndDate: string | null;
    wizardCompleted: boolean;
  }
}
