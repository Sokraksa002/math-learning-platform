import { FastifyReply } from "fastify";

/**
 * Ensure a resource exists; if not, send a 404 response and return false.
 */
export function ensureExists<T>(
  resource: T | null | undefined,
  reply: FastifyReply,
  resourceName = "Resource"
): resource is T {
  if (resource == null) {
    reply.code(404).send({ success: false, message: `${resourceName} not found` });
    return false;
  }
  return true;
}

/**
 * Ensure the resource is owned by the requesting user; if not, send a 403 and return false.
 */
export function ensureOwned(
  resourceUserId: string | null | undefined,
  requestUserId: string,
  reply: FastifyReply,
  message = "Forbidden"
): boolean {
  if (resourceUserId !== requestUserId) {
    reply.code(403).send({ success: false, message });
    return false;
  }
  return true;
}

/**
 * Convenience: ensure a resource exists and is owned by the requesting user.
 */
export function ensureExistsAndOwned<T extends { userId?: string }>(
  resource: T | null | undefined,
  requestUserId: string,
  reply: FastifyReply,
  resourceName = "Resource"
): resource is T {
  if (!ensureExists(resource, reply, resourceName)) return false;
  return ensureOwned(resource.userId ?? null, requestUserId, reply);
}
