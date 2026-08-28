import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding System Features and Subscription Plans...");

  // 1. Seed System Features
  const features = [
    { code: "PROFILE", name: "Profile Management", description: "Basic profile details" },
    { code: "GALLERY", name: "Gallery Management", description: "Upload and manage photos" },
    { code: "STAFF", name: "Staff Management", description: "Manage teachers and staff" },
    { code: "NOTICE", name: "Notice Board", description: "Publish notices and news" },
    { code: "ADMISSION", name: "Admission System", description: "Manage admissions" },
    { code: "SMS", name: "SMS Alerts", description: "Send SMS notifications" }
  ];

  for (const feature of features) {
    await prisma.systemFeature.upsert({
      where: { code: feature.code },
      update: feature,
      create: feature,
    });
  }
  console.log("System Features seeded.");

  const allFeatures = await prisma.systemFeature.findMany();
  const getFeatureId = (code: string) => allFeatures.find(f => f.code === code)?.id;

  // 2. Seed Subscription Plans
  const plans = [
    {
      slug: "basic-1y",
      name: "১ বছরের প্ল্যান (বেসিক)",
      durationYear: 1,
      pricePerYear: 500,
      totalPrice: 500,
      active: true,
      features: ["PROFILE", "GALLERY", "STAFF"]
    },
    {
      slug: "popular-3y",
      name: "৩ বছরের প্ল্যান (জনপ্রিয়)",
      durationYear: 3,
      pricePerYear: 400,
      totalPrice: 1200,
      active: true,
      features: ["PROFILE", "GALLERY", "STAFF", "NOTICE", "ADMISSION"]
    },
    {
      slug: "premium-5y",
      name: "৫ বছরের প্ল্যান (প্রিমিয়াম)",
      durationYear: 5,
      pricePerYear: 360,
      totalPrice: 1800,
      active: true,
      features: ["PROFILE", "GALLERY", "STAFF", "NOTICE", "ADMISSION", "SMS"]
    }
  ];

  for (const plan of plans) {
    const { features, ...planData } = plan;
    
    const existing = await prisma.subscriptionPlan.findUnique({
      where: { slug: plan.slug }
    });

    let planRecord;
    if (!existing) {
      planRecord = await prisma.subscriptionPlan.create({
        data: planData
      });
      console.log(`Created plan: ${plan.name}`);
    } else {
      planRecord = await prisma.subscriptionPlan.update({
        where: { slug: plan.slug },
        data: planData
      });
      console.log(`Updated plan: ${plan.name}`);
    }

    // Connect features
    for (const code of features) {
      const featureId = getFeatureId(code);
      if (featureId) {
        await prisma.planFeature.upsert({
          where: {
            planId_featureId: {
              planId: planRecord.id,
              featureId: featureId
            }
          },
          update: {},
          create: {
            planId: planRecord.id,
            featureId: featureId
          }
        });
      }
    }
  }

  console.log("Seeding completed.");
}

main()
  .catch((e) => {
    console.error("Error seeding plans:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
