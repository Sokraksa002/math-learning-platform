import * as authService from '../auth.service';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcrypt';

jest.mock('../../../lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock('bcrypt');

const mockedPrisma = prisma as unknown as any;
// simplify bcrypt mock typing for tests
const mockedBcrypt = bcrypt as unknown as { hash: jest.Mock };

describe('auth.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('register creates a new user', async () => {
    mockedPrisma.user.findUnique.mockResolvedValue(null);
    mockedBcrypt.hash.mockResolvedValue('hashed');
    mockedPrisma.user.create.mockResolvedValue({
      id: '1',
      email: 'a@a.com',
      name: 'A',
      createdAt: new Date(),
    });

    const user = await authService.register({ email: 'a@a.com', name: 'A', password: 'pass' });

    expect(mockedPrisma.user.findUnique).toHaveBeenCalled();
    expect(mockedBcrypt.hash).toHaveBeenCalledWith('pass', 10);
    expect(mockedPrisma.user.create).toHaveBeenCalled();
    expect(user.email).toBe('a@a.com');
  });

  test('login throws on invalid credentials', async () => {
    mockedPrisma.user.findUnique.mockResolvedValue(null);
    await expect(authService.login({ email: 'b@b.com', password: 'x' })).rejects.toThrow();
  });
});
