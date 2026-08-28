const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const boards = await prisma.educationBoard.findMany({
    select: { id: true, name: true, logoUrl: true }
  });
  console.log(JSON.stringify(boards, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
