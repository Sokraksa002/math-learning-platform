import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function main() {
  const password = "password123";
  const passwordHash = await bcrypt.hash(password, 10);

  const users = [
    {
      email: "student1@example.com",
      name: "Student One",
      passwordHash,
      role: "STUDENT",
      isBanned: false,
    },
    {
      email: "admin@example.com",
      name: "Admin",
      passwordHash,
      role: "ADMIN",
      isBanned: false,
    },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {
        name: u.name,
        passwordHash: u.passwordHash,
        role: (u as any).role,
        isBanned: u.isBanned,
      },
      create: {
        name: u.name,
        email: u.email,
        passwordHash: u.passwordHash,
        role: (u as any).role,
        isBanned: u.isBanned,
      },
    });
  }

  console.log("Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });