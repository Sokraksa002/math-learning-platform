import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../lib/prisma';
import { ensureExists } from '../../lib/authHelpers';
import { requireAdmin } from '../../modules/admin/admin.controller';

/**
 * Admin-only certificate management
 */
export async function adminCertificateRoutes(app: FastifyInstance) {
  /**
   * List all certificates
   */
  app.get(
    '/admin/certificates',
    {
      preHandler: [app.authenticate, requireAdmin], // 👑 ADMIN ONLY
    },
    async () => {
      const certificates = await prisma.certificate.findMany({
        orderBy: { issuedAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return {
        success: true,
        data: certificates.map((certificate) => ({
          ...certificate,
          status: certificate.revokedAt ? 'revoked' : 'verified',
        })),
      };
    },
  );

  /**
   * Revoke a certificate
   */
  app.post(
    '/admin/certificates/:certificateId/revoke',
    {
      preHandler: [app.authenticate, requireAdmin], // 👑 ADMIN ONLY
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
