/// <reference types="node" />
import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function main() {
  try {
    const one = await prisma.user.findFirst()
    console.log('Prisma ok, sample user:', one ? { id: one.id, email: one.email } : 'none')
  } catch (err) {
    console.error('Prisma error:', err)
    process.exitCode = 1
  } finally {
    await prisma.$disconnect()
  }
}

main()
