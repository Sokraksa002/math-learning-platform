import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import * as bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { registerJsonSchema, loginJsonSchema } from '../validators/auth';

/**
 * Authentication routes
 */
export async function authRoutes(app: FastifyInstance) {
  /**
   * ✅ REGISTER (RETURN TOKEN → AUTO LOGIN)
   */
  app.post(
    '/register',
    { schema: { body: registerJsonSchema } },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { email, name, password } = request.body as {
        email: string;
        name: string;
        password: string;
      };

      try {
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (existingUser) {
          return reply.code(409).send({
            success: false,
            message: 'Email already exists',
          });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
          data: {
            email,
            name,
            passwordHash,
          },
        });

        // ✅ AUTO LOGIN TOKEN
        const token = await reply.jwtSign({
          userId: user.id,
          role: user.role,
        });

        return reply.code(201).send({
          success: true,
          data: {
            token,
            user: {
              id: user.id,
              email: user.email,
              role: user.role,
              createdAt: user.createdAt,
            },
          },
          message: 'Registration successful',
        });
      } catch (error) {
        console.error('[auth/register]', error);
        return reply.code(500).send({
          success: false,
          message: 'Internal server error',
        });
      }
    },
  );

  /**
   * ✅ LOGIN
   */
  app.post(
    '/login',
    { schema: { body: loginJsonSchema } },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { email, password } = request.body as {
        email: string;
        password: string;
      };

      try {
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          return reply.code(401).send({
            success: false,
            message: 'Invalid email or password',
          });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if (!isMatch) {
          return reply.code(401).send({
            success: false,
            message: 'Invalid email or password',
          });
        }

        const token = await reply.jwtSign({
          userId: user.id,
          role: user.role,
        });

        return reply.send({
          success: true,
          data: {
            token,
            user: {
              id: user.id,
              email: user.email,
              role: user.role,
            },
          },
          message: 'Login successful',
        });
      } catch (error) {
        console.error('[auth/login]', error);
        return reply.code(500).send({
          success: false,
          message: 'Internal server error',
        });
      }
    },
  );

  /**
   * ✅ FORGOT PASSWORD
   */
  app.post('/forgot-password', async (request: FastifyRequest, reply: FastifyReply) => {
    const { email } = request.body as { email: string };

    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      // ✅ Do NOT reveal if email exists
      if (!user) {
        return reply.send({
          message: 'If this email exists, a reset link will be sent',
        });
      }

      // ✅ Generate simple reset token (in real app: save in DB)
      const resetToken = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

      console.log('Reset token:', resetToken);

      // ✅ In real app → send email here
      // e.g. sendEmail(user.email, link)

      return reply.send({
        message: 'Password reset link generated (check backend log)',
        resetToken,
      });
    } catch (error) {
      console.error('[auth/forgot-password]', error);
      return reply.code(500).send({
        message: 'Internal server error',
      });
    }
  });

  /**
   * ✅ RESET PASSWORD
   */
  app.post('/reset-password', async (request: FastifyRequest, reply: FastifyReply) => {
    const { token, newPassword } = request.body as {
      token: string;
      newPassword: string;
    };

    try {
      // ✅ Decode token
      const decoded = Buffer.from(token, 'base64').toString('ascii');

      const [userId] = decoded.split(':');

      const passwordHash = await bcrypt.hash(newPassword, 12);

      await prisma.user.update({
        where: { id: userId },
        data: { passwordHash },
      });

      return reply.send({
        message: 'Password reset successful',
      });
    } catch (error) {
      console.error('[auth/reset-password]', error);
      return reply.code(400).send({
        message: 'Invalid or expired token',
      });
    }
  });
}
``;
