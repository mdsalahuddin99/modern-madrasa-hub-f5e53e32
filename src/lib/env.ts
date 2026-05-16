import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url(),
  AUTH_SECRET: z.string().min(1),
  AUTH_URL: z.string().url(),
  NEXTAUTH_URL: z.string().url(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
  GMAIL_USER: z.string().email().optional(),
  GMAIL_APP_PASSWORD: z.string().optional(),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:", parsedEnv.error.flatten().fieldErrors);
  throw new Error("Invalid environment variables");
}

export const env = parsedEnv.data;
