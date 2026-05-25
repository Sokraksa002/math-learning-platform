import bcrypt from 'bcrypt';
import { prisma } from '../../lib/prisma';

/**
 * Register a new user
 */
export async function register(data: { email: string; name: string; password: string }) {
  // Check if email already exists
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existing) {
    throw new Error('Email already exists');
  }

  // Hash password
  const passwordHash = await bcrypt.hash(data.password, 10);

  // Create user
  return prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      passwordHash, // ✅ camelCase mapped to password_hash
    },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true, // ✅ camelCase mapped to created_at
    },
  });
}

/**
 * Login user
 */
export async function login(data: { email: string; password: string }) {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Compare password
  const valid = await bcrypt.compare(
    data.password,
    user.passwordHash, // ✅ mapped field
  );

  if (!valid) {
    throw new Error('Invalid credentials');
  }

  return user;
}
