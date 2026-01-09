const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "admin@local.app" },
    update: {},
    create: {
      email: "admin@local.app",
      password: "temp-password",
    },
  });

  console.log("Default user created:", user);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
