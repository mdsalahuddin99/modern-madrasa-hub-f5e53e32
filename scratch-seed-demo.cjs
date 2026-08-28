const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  // Super Admin
  await prisma.user.upsert({
    where: { email: 'superadmin@madrasa.com' },
    update: {},
    create: {
      email: 'superadmin@madrasa.com',
      hashedPassword: passwordHash,
      name: 'সুপার এডমিন',
      role: 'SUPER_ADMIN',
    },
  });

  // Madrasa Admin
  await prisma.user.upsert({
    where: { email: 'admin@madrasa.com' },
    update: {},
    create: {
      email: 'admin@madrasa.com',
      hashedPassword: passwordHash,
      name: 'মাদ্রাসা এডমিন',
      role: 'INSTITUTION_ADMIN',
    },
  });

  // Regular User
  await prisma.user.upsert({
    where: { email: 'user@madrasa.com' },
    update: {},
    create: {
      email: 'user@madrasa.com',
      hashedPassword: passwordHash,
      name: 'সাধারণ ইউজার',
      role: 'USER',
    },
  });

  // Create Dummy Location
  const div = await prisma.division.upsert({
    where: { slug: 'dhaka' },
    update: {},
    create: { nameBn: 'ঢাকা', nameEn: 'Dhaka', slug: 'dhaka' }
  });
  const dist = await prisma.district.upsert({
    where: { slug: 'dhaka-dist' },
    update: {},
    create: { nameBn: 'ঢাকা', nameEn: 'Dhaka', slug: 'dhaka-dist', divisionId: div.id }
  });
  const thana = await prisma.thana.upsert({
    where: { slug: 'dhaka-thana' },
    update: {},
    create: { nameBn: 'মিরপুর', nameEn: 'Mirpur', slug: 'dhaka-thana', districtId: dist.id }
  });

  // Get Admin ID
  const admin = await prisma.user.findUnique({ where: { email: 'admin@madrasa.com' }});

  // Create Dummy Madrasa for Admin
  await prisma.madrasa.upsert({
    where: { slug: 'demo-madrasa' },
    update: {},
    create: {
      name: 'ডেমো মাদ্রাসা (মাদ্রাসা এডমিন)',
      slug: 'demo-madrasa',
      category: 'JAMIA',
      board: 'BEFAQ',
      phone: '01700000000',
      email: 'contact@demomadrasa.com',
      address: 'মিরপুর, ঢাকা',
      divisionId: div.id,
      districtId: dist.id,
      thanaId: thana.id,
      directorId: admin.id,
      status: 'APPROVED',
      students: 500,
      teachers: 20
    }
  });

  console.log('Demo users and demo madrasa seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
