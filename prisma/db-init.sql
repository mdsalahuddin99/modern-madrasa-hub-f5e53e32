-- ====================================================================
-- PostgreSQL DDL Script for Modern Madrasa Hub
-- Generated based on Prisma Schema & Architecture Audit Report
-- ====================================================================

-- ─── 1. DROP EXISTING TABLES (IF ANY) ──────────────────────────────
-- (Optional: useful for clean re-creation)
-- DROP TABLE IF EXISTS "PerformanceAnalytics" CASCADE;
-- DROP TABLE IF EXISTS "SiteContent" CASCADE;
-- DROP TABLE IF EXISTS "Subscription" CASCADE;
-- DROP TABLE IF EXISTS "SubscriptionPlan" CASCADE;
-- DROP TABLE IF EXISTS "Review" CASCADE;
-- DROP TABLE IF EXISTS "Teacher" CASCADE;
-- DROP TABLE IF EXISTS "GalleryImage" CASCADE;
-- DROP TABLE IF EXISTS "Facility" CASCADE;
-- DROP TABLE IF EXISTS "Course" CASCADE;
-- DROP TABLE IF EXISTS "Madrasa" CASCADE;
-- DROP TABLE IF EXISTS "PasswordResetToken" CASCADE;
-- DROP TABLE IF EXISTS "VerificationToken" CASCADE;
-- DROP TABLE IF EXISTS "Session" CASCADE;
-- DROP TABLE IF EXISTS "Account" CASCADE;
-- DROP TABLE IF EXISTS "User" CASCADE;

-- DROP TYPE IF EXISTS "UserRole" CASCADE;
-- DROP TYPE IF EXISTS "MadrasaStatus" CASCADE;
-- DROP TYPE IF EXISTS "MadrasaCategory" CASCADE;
-- DROP TYPE IF EXISTS "MadrasaBoard" CASCADE;
-- DROP TYPE IF EXISTS "SubscriptionStatus" CASCADE;
-- DROP TYPE IF EXISTS "PaymentMethod" CASCADE;

-- ─── 2. ENUMS ───────────────────────────────────────────────────────

CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'DIRECTOR');
CREATE TYPE "MadrasaStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE "MadrasaCategory" AS ENUM ('JAMIA', 'MADRASA', 'HIFZ', 'NURANI', 'MOHILA', 'ISLAMIC_SCHOOL', 'HIGHER_EDU', 'OTHERS');
CREATE TYPE "MadrasaBoard" AS ENUM ('BEFAQ', 'GAWHARDANGA', 'ITTEHADUL', 'AZAD_DEENI', 'TANZIMUL', 'JATIYA_DEENI');
CREATE TYPE "SubscriptionStatus" AS ENUM ('PENDING', 'ACTIVE', 'EXPIRED', 'REJECTED');
CREATE TYPE "PaymentMethod" AS ENUM ('BKASH', 'NAGAD', 'ROCKET', 'BANK');

-- ─── 3. PARENT TABLES ───────────────────────────────────────────────

-- Table: User
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "hashedPassword" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'DIRECTOR',
    "wizardCompleted" BOOLEAN NOT NULL DEFAULT false,
    "subscriptionActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- Table: SubscriptionPlan
CREATE TABLE "SubscriptionPlan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "durationYear" INTEGER NOT NULL,
    "pricePerYear" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "features" TEXT[] NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "SubscriptionPlan_pkey" PRIMARY KEY ("id")
);

-- Table: SiteContent
CREATE TABLE "SiteContent" (
    "id" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SiteContent_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "SiteContent_section_key" ON "SiteContent"("section");

-- Table: VerificationToken
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- ─── 4. CHILD TABLES (Level 1) ──────────────────────────────────────

-- Table: Madrasa
CREATE TABLE "Madrasa" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "division" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "thana" TEXT NOT NULL,
    "category" "MadrasaCategory" NOT NULL,
    "board" "MadrasaBoard" NOT NULL,
    "established" TEXT NOT NULL,
    "students" INTEGER NOT NULL DEFAULT 0,
    "teachers" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "website" TEXT,
    "subdomain" TEXT,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "bannerImage" TEXT,
    "tagline" TEXT,
    "history" TEXT,
    "mission" TEXT,
    "vision" TEXT,
    "principalName" TEXT,
    "principalRole" TEXT,
    "principalMessage" TEXT,
    "alumniCount" TEXT,
    "notableAlumni" TEXT,
    "admissionRules" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "admissionImages" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "departments" JSONB DEFAULT '[]',
    "premiumFeatures" JSONB DEFAULT '{}',
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" TEXT,
    "status" "MadrasaStatus" NOT NULL DEFAULT 'PENDING',
    "admissionOpen" BOOLEAN NOT NULL DEFAULT false,
    "admissionFile" TEXT,
    "admissionFileType" TEXT,
    "directorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Madrasa_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Madrasa_directorId_fkey" FOREIGN KEY ("directorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "Madrasa_subdomain_key" ON "Madrasa"("subdomain");

-- Table: Account
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- Table: Session
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- Table: PasswordResetToken
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Table: PerformanceAnalytics
CREATE TABLE "PerformanceAnalytics" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionDuration" INTEGER NOT NULL,
    "pageLoadTime" INTEGER,
    "firstContentfulPaint" INTEGER,
    "largestContentfulPaint" INTEGER,
    "timeToInteractive" INTEGER,
    "totalBlockingTime" INTEGER,
    "cumulativeLayoutShift" DOUBLE PRECISION,
    "interactionCount" INTEGER NOT NULL,
    "errorCount" INTEGER NOT NULL,
    "userAgent" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PerformanceAnalytics_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "PerformanceAnalytics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- ─── 5. CHILD TABLES (Level 2 - Dependent on Madrasa) ───────────────

-- Table: Course
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "madrasaId" TEXT NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Course_madrasaId_fkey" FOREIGN KEY ("madrasaId") REFERENCES "Madrasa"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Table: Facility
CREATE TABLE "Facility" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "madrasaId" TEXT NOT NULL,

    CONSTRAINT "Facility_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Facility_madrasaId_fkey" FOREIGN KEY ("madrasaId") REFERENCES "Madrasa"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Table: GalleryImage
CREATE TABLE "GalleryImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "madrasaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GalleryImage_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "GalleryImage_madrasaId_fkey" FOREIGN KEY ("madrasaId") REFERENCES "Madrasa"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Table: Teacher
CREATE TABLE "Teacher" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "department" TEXT,
    "image" TEXT,
    "bio" TEXT,
    "madrasaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Teacher_madrasaId_fkey" FOREIGN KEY ("madrasaId") REFERENCES "Madrasa"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Table: Review
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "comment" TEXT,
    "userId" TEXT NOT NULL,
    "madrasaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Review_madrasaId_fkey" FOREIGN KEY ("madrasaId") REFERENCES "Madrasa"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Table: Subscription
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "madrasaId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'PENDING',
    "paymentMethod" "PaymentMethod" NOT NULL,
    "transactionId" TEXT NOT NULL,
    "payerPhone" TEXT NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "reviewNote" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Subscription_madrasaId_fkey" FOREIGN KEY ("madrasaId") REFERENCES "Madrasa"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "SubscriptionPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- ─── 6. INDEXES FOR PERFORMANCE ─────────────────────────────────────

-- User Indexes
CREATE INDEX "User_role_idx" ON "User"("role");
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");

-- PasswordResetToken Indexes
CREATE INDEX "PasswordResetToken_userId_idx" ON "PasswordResetToken"("userId");
CREATE INDEX "PasswordResetToken_token_idx" ON "PasswordResetToken"("token");

-- Madrasa Indexes
CREATE INDEX "Madrasa_directorId_idx" ON "Madrasa"("directorId");
CREATE INDEX "Madrasa_location_idx" ON "Madrasa"("division", "district", "thana");
CREATE INDEX "Madrasa_status_category_idx" ON "Madrasa"("status", "category");
CREATE INDEX "Madrasa_board_idx" ON "Madrasa"("board");
CREATE INDEX "Madrasa_featured_status_idx" ON "Madrasa"("featured", "status");
CREATE INDEX "Madrasa_createdAt_idx" ON "Madrasa"("createdAt");

-- Course & Facility Indexes
CREATE INDEX "Course_madrasaId_idx" ON "Course"("madrasaId");
CREATE INDEX "Facility_madrasaId_idx" ON "Facility"("madrasaId");
CREATE INDEX "GalleryImage_madrasaId_idx" ON "GalleryImage"("madrasaId");
CREATE INDEX "Teacher_madrasaId_idx" ON "Teacher"("madrasaId");

-- Review Indexes
CREATE INDEX "Review_userId_idx" ON "Review"("userId");
CREATE INDEX "Review_madrasaId_idx" ON "Review"("madrasaId");

-- Subscription Indexes
CREATE INDEX "Subscription_status_submittedAt_idx" ON "Subscription"("status", "submittedAt");
CREATE INDEX "Subscription_userId_idx" ON "Subscription"("userId");
CREATE INDEX "Subscription_madrasaId_idx" ON "Subscription"("madrasaId");
CREATE INDEX "Subscription_transactionId_idx" ON "Subscription"("transactionId");

-- PerformanceAnalytics Indexes
CREATE INDEX "PerformanceAnalytics_userId_idx" ON "PerformanceAnalytics"("userId");
CREATE INDEX "PerformanceAnalytics_timestamp_idx" ON "PerformanceAnalytics"("timestamp");
CREATE INDEX "PerformanceAnalytics_sessionId_idx" ON "PerformanceAnalytics"("sessionId");
