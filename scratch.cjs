const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const madrasas = await prisma.madrasa.findMany();
  console.log('Madrasas:', madrasas.length);

  const divs = await prisma.division.findMany();
  console.log('Divisions:', divs.length);

  const dists = await prisma.district.findMany();
  console.log('Districts:', dists.length);
  
  const thanas = await prisma.thana.findMany();
  console.log('Thanas:', thanas.length);
  
  if (madrasas.length > 0) {
    console.log('Sample madrasa divisionId:', madrasas[0].divisionId);
  }
}

main().finally(() => prisma.$disconnect());
