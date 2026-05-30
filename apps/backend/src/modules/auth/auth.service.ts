import bcrypt from 'bcrypt';
import { prisma } from '../../lib/prisma';

/* ✅ REGISTER */
export async function register(data: { email: string; name: string; password: string }) {
  const email = data.email.toLowerCase().trim();

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    throw new Error('Email already exists');
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      name: data.name,
      passwordHash,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  return user;
}

/* ✅ LOGIN */
export async function login(data: { email: string; password: string }) {
  const email = data.email.toLowerCase().trim();

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  /* ✅ SAFETY CHECK */
  if (!user.passwordHash) {
    throw new Error('User password not set');
  }

  const isValid = await bcrypt.compare(data.password, user.passwordHash);

  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}
