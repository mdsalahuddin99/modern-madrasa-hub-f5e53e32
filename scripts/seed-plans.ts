import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding default subscription plans...");

  const plans = [
    {
      name: "১ বছরের প্ল্যান (বেসিক)",
      durationYear: 1,
      pricePerYear: 500,
      totalPrice: 500,
      features: [
        "সম্পূর্ণ ড্যাশবোর্ড এক্সেস",
        "মাদ্রাসার তথ্য ও গ্যালারি আপডেট",
        "পাবলিক প্রোফাইল দৃশ্যমানতা",
        "বেসিক সাপোর্ট"
      ],
      active: true,
    },
    {
      name: "৩ বছরের প্ল্যান (জনপ্রিয়)",
      durationYear: 3,
      pricePerYear: 400,
      totalPrice: 1200,
      features: [
        "১ বছর ফ্রি (তুলনামূলক)",
        "সম্পূর্ণ ড্যাশবোর্ড এক্সেস",
        "এসএমএস অ্যালার্ট (প্রস্তাবিত)",
        "পাবলিক প্রোফাইল দৃশ্যমানতা",
        "প্রায়োরিটি সাপোর্ট"
      ],
      active: true,
    },
    {
      name: "৫ বছরের প্ল্যান (প্রিমিয়াম)",
      durationYear: 5,
      pricePerYear: 360,
      totalPrice: 1800,
      features: [
        "প্রায় ২ বছর ফ্রি (তুলনামূলক)",
        "সম্পূর্ণ ড্যাশবোর্ড এক্সেস",
        "প্রিমিয়াম ব্যাজ",
        "পাবলিক প্রোফাইল দৃশ্যমানতা",
        "২৪/৭ প্রায়োরিটি সাপোর্ট"
      ],
      active: true,
    }
  ];

  for (const plan of plans) {
    // Check if a plan with the same duration already exists to avoid duplicates
    const existing = await prisma.subscriptionPlan.findFirst({
      where: { durationYear: plan.durationYear }
    });

    if (!existing) {
      await prisma.subscriptionPlan.create({
        data: plan
      });
      console.log(`Created plan: ${plan.name}`);
    } else {
      console.log(`Plan already exists for duration: ${plan.durationYear} year(s)`);
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
