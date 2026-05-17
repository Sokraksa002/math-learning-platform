import "dotenv/config";
import { prisma } from "../src/lib/prisma";

(async function main() {
  try {
    console.log("Prisma client keys:", Object.keys(prisma).sort());
  } catch (err) {
    console.error("Error printing prisma keys:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();