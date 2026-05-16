# Database Entity Relationship Diagram (ERD)
এই ডকুমেন্টে মডার্ন মাদ্রাসা হাবের ডেটাবেজ আর্কিটেকচার এবং রিলেশনশিপগুলো Mermaid.js ব্যবহার করে ভিজ্যুয়ালাইজ করা হয়েছে।

## 📊 ER Diagram (Mermaid.js)

```mermaid
erDiagram
    %% ─── Core Models ───
    User {
        String id PK "cuid()"
        String name
        String email UK "Unique"
        DateTime emailVerified
        String image
        String hashedPassword
        String role "Enum: ADMIN | DIRECTOR"
        Boolean wizardCompleted
        Boolean subscriptionActive
        DateTime createdAt
        DateTime updatedAt
    }

    Madrasa {
        String id PK "cuid()"
        String name
        String division
        String district
        String thana
        String category
        String board
        String established
        Int students
        Int teachers
        String description
        String address
        String phone
        String email
        String website
        String subdomain UK "Unique"
        Float rating
        Boolean featured
        String image
        String bannerImage
        String tagline
        String history
        String mission
        String vision
        String principalName
        String principalRole
        String principalMessage
        String alumniCount
        String notableAlumni
        String_Array admissionRules
        String_Array admissionImages
        Json departments
        Json premiumFeatures
        String metaTitle
        String metaDescription
        String metaKeywords
        String status "Enum: PENDING | APPROVED | REJECTED"
        Boolean admissionOpen
        String admissionFile
        String admissionFileType
        String directorId FK "Refers to User.id"
        DateTime createdAt
        DateTime updatedAt
    }

    %% ─── Auth & Security Models ───
    Account {
        String id PK "cuid()"
        String userId FK "Refers to User.id"
        String type
        String provider
        String providerAccountId
        String refresh_token
        String access_token
        Int expires_at
        String token_type
        String scope
        String id_token
        String session_state
    }
    
    Session {
        String id PK "cuid()"
        String sessionToken UK "Unique"
        String userId FK "Refers to User.id"
        DateTime expires
    }

    VerificationToken {
        String identifier PK
        String token UK "Unique"
        DateTime expires
    }

    PasswordResetToken {
        String id PK "cuid()"
        String userId FK "Refers to User.id"
        String token
        DateTime expiresAt
        Boolean used
        DateTime createdAt
    }

    %% ─── Madrasa Child Models ───
    Course {
        String id PK "cuid()"
        String name
        String madrasaId FK "Refers to Madrasa.id"
    }

    Facility {
        String id PK "cuid()"
        String name
        String madrasaId FK "Refers to Madrasa.id"
    }

    GalleryImage {
        String id PK "cuid()"
        String url
        String caption
        Int order
        String madrasaId FK "Refers to Madrasa.id"
        DateTime createdAt
    }

    Teacher {
        String id PK "cuid()"
        String name
        String designation
        String department
        String image
        String bio
        String madrasaId FK "Refers to Madrasa.id"
        DateTime createdAt
        DateTime updatedAt
    }

    Review {
        String id PK "cuid()"
        Int rating
        String comment
        String userId FK "Refers to User.id"
        String madrasaId FK "Refers to Madrasa.id"
        DateTime createdAt
        DateTime updatedAt
    }

    %% ─── Subscription Models ───
    SubscriptionPlan {
        String id PK "cuid()"
        String name
        Int durationYear
        Int pricePerYear
        Int totalPrice
        String_Array features
        Boolean active
    }

    Subscription {
        String id PK "cuid()"
        String userId FK "Refers to User.id"
        String madrasaId FK "Refers to Madrasa.id"
        String planId FK "Refers to SubscriptionPlan.id"
        String status "Enum: PENDING | ACTIVE | EXPIRED"
        String paymentMethod "Enum: BKASH | NAGAD | ROCKET | BANK"
        String transactionId
        String payerPhone
        DateTime startDate
        DateTime endDate
        String reviewNote
        DateTime submittedAt
        DateTime reviewedAt
    }

    %% ─── Analytics & Content ───
    SiteContent {
        String id PK "cuid()"
        String section UK "Unique"
        Json content
        DateTime updatedAt
    }

    PerformanceAnalytics {
        String id PK "cuid()"
        String sessionId
        String userId FK "Refers to User.id"
        Int sessionDuration
        Int pageLoadTime
        Int firstContentfulPaint
        Int largestContentfulPaint
        Int timeToInteractive
        Int totalBlockingTime
        Float cumulativeLayoutShift
        Int interactionCount
        Int errorCount
        String userAgent
        DateTime timestamp
    }

    %% ─── Relationships ───
    
    %% User Relationships (One-to-Many)
    User ||--o{ Account : "has (1:N)"
    User ||--o{ Session : "has (1:N)"
    User ||--o{ PasswordResetToken : "requests reset (1:N)"
    User ||--o{ Madrasa : "directs/owns (1:N)"
    User ||--o{ Subscription : "purchases (1:N)"
    User ||--o{ Review : "writes (1:N)"
    User ||--o{ PerformanceAnalytics : "generates logs (1:N)"

    %% Madrasa Relationships (One-to-Many)
    Madrasa ||--o{ Course : "offers (1:N)"
    Madrasa ||--o{ Facility : "provides (1:N)"
    Madrasa ||--o{ GalleryImage : "displays (1:N)"
    Madrasa ||--o{ Teacher : "employs (1:N)"
    Madrasa ||--o{ Review : "receives (1:N)"
    Madrasa ||--o{ Subscription : "is subscribed under (1:N)"

    %% Subscription Plan Relationships (One-to-Many)
    SubscriptionPlan ||--o{ Subscription : "is linked to (1:N)"
```

## 🔍 রিলেশনশিপ বিশ্লেষণ (Relationship Analysis)

### ১. User (মাদ্রাসা ওনার/ডিরেক্টর) কেন্দ্রিক রিলেশন (1:N)
- **User -> Madrasa**: একজন ডিরেক্টরের অধীনে একাধিক মাদ্রাসা থাকতে পারে। (`directorId` ফরেন কি)।
- **User -> Subscription**: একজন ইউজার একাধিকবার সাবস্ক্রিপশন কিনতে পারেন (রিনিউ করার ক্ষেত্রে)। (`userId` ফরেন কি)।
- **User -> Review**: একজন ইউজার বিভিন্ন মাদ্রাসায় রিভিউ দিতে পারেন। (`userId` ফরেন কি)।

### ২. Madrasa কেন্দ্রিক রিলেশন (1:N)
- **Madrasa -> Course / Facility / GalleryImage / Teacher**: একটি মাদ্রাসার অধীনে একাধিক কোর্স, সুবিধা, গ্যালারি ছবি এবং শিক্ষক থাকতে পারে। এই চাইল্ড টেবিলগুলোতে `madrasaId` ফরেন কি হিসেবে কাজ করছে এবং এখানে `onDelete: Cascade` ব্যবহার করা হয়েছে, অর্থাৎ মাদ্রাসা ডিলিট হলে এগুলোও মুছে যাবে।
- **Madrasa -> Review**: একটি মাদ্রাসায় একাধিক ইউজার রিভিউ দিতে পারেন। (`madrasaId` ফরেন কি)।

### ৩. Subscription কেন্দ্রিক রিলেশন (1:N)
- **SubscriptionPlan -> Subscription**: একটি সাবস্ক্রিপশন প্ল্যানের (যেমন: 'Yearly Premium') অধীনে একাধিক সাবস্ক্রিপশন পারচেজ এন্ট্রি থাকতে পারে। (`planId` ফরেন কি)।

### 🔑 প্রাইমারি ও ইউনিক কি (Keys & Constraints)
- **PK (Primary Key):** সব টেবিলেই `id` কলামটি প্রাইমারি কি হিসেবে ব্যবহৃত হয়েছে এবং ডাটা টাইপ হিসেবে `cuid()` জেনারেট হচ্ছে।
- **UK (Unique Key):** 
  - `User` টেবিলে `email` ইউনিক।
  - `Madrasa` টেবিলে `subdomain` ইউনিক (যাতে একই সাব-ডোমেইন দুজন না পায়)।
  - `SiteContent` টেবিলে `section` ইউনিক।

এই ডায়াগ্রামটি ব্যবহার করে যেকোনো ডেভেলপার সহজেই প্রজেক্টের ডেটাবেজ আর্কিটেকচার বুঝতে পারবেন।