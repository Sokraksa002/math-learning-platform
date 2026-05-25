import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../lib/prisma';
import { ensureExists } from '../../lib/authHelpers';

/**
 * Admin-only certificate management
 */
export async function adminCertificateRoutes(app: FastifyInstance) {
  /**
   * Revoke a certificate
   */
  app.post(
    '/admin/certificates/:certificateId/revoke',
    {
      preHandler: app.requireAdmin, // 👑 ADMIN ONLY
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { certificateId } = request.params as {
        certificateId: string;
      };

      const certificate = await prisma.certificate.findUnique({
        where: { id: certificateId },
      });
      if (!ensureExists(certificate, reply, 'Certificate')) return;

      if (certificate.revokedAt) {
        return {
          success: false,
          message: 'Certificate already revoked',
        };
      }

      const revoked = await prisma.certificate.update({
        where: { id: certificateId },
        data: {
          revokedAt: new Date(),
        },
      });

      return {
        success: true,
        data: revoked,
        message: 'Certificate revoked successfully',
      };
    },
  );
}
