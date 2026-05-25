import { FastifyInstance, FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma";
import { sendCertificateEmail } from "../lib/mailer";
import { ensureExistsAndOwned } from "../lib/authHelpers";

export async function certificateEmailRoutes(app: FastifyInstance) {
  /**
   * Send certificate PDF by email
   */
  app.post(
    "/certificates/:certificateId/email",
    {
      preHandler: app.authenticate,
    },
  async (request: FastifyRequest, reply) => {
      const { certificateId } = request.params as {
        certificateId: string;
      };

      const certificate = await prisma.certificate.findUnique({
        where: { id: certificateId },
        include: {
          user: {
            select: {
              email: true,
              name: true,
            },
          },
        },
      });

  const userId = request.user.userId;
  if (!ensureExistsAndOwned(certificate, userId, reply, "Certificate")) return;

      if (certificate.revokedAt) {
        return { success: false, message: "Certificate is revoked" };
      }

      if (!certificate.pdfUrl) {
        return {
          success: false,
          message: "Certificate PDF not generated yet",
        };
      }

      await sendCertificateEmail(
        certificate.user.email,
        certificate.user.name,
        certificate.pdfUrl
      );

      return {
        success: true,
        message: "Certificate sent by email",
      };
    }
  );
}