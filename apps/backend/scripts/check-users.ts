import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

async function main(){
  console.log('users count:', await prisma.user.count());
  console.log('first user:', await prisma.user.findFirst());
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });