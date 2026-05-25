import { FastifyInstance, FastifyRequest } from 'fastify';
import { prisma } from '../lib/prisma';

/**
 * Public certificate verification
 */
export async function certificateVerificationRoutes(app: FastifyInstance) {
  /**
   * Verify a certificate by its code
   */
  app.get('/certificates/verify/:certificateCode', async (request: FastifyRequest) => {
    const { certificateCode } = request.params as {
      certificateCode: string;
    };

    const certificate = await prisma.certificate.findUnique({
      where: { certificateCode },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!certificate) {
      return {
        success: false,
        message: 'Certificate not found',
      };
    }

    if (certificate.revokedAt) {
      return {
        success: false,
        message: 'Certificate has been revoked',
      };
    }

    return {
      success: true,
      data: {
        certificateCode: certificate.certificateCode,
        course: certificate.course,
        issuedAt: certificate.issuedAt,
        student: {
          name: certificate.user.name,
          email: certificate.user.email,
        },
      },
    };
  });
}
