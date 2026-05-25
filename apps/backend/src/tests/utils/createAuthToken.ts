import type { FastifyInstance } from 'fastify';

/**
 * Create a signed JWT for tests using an existing Fastify app instance.
 * If the auth plugin hasn't been registered on the app, this helper will register it
 * (it uses the project's `src/plugins/auth.ts`).
 *
 * Usage in tests:
 *   const token = await createAuthToken(app, { userId: 'u1', role: 'STUDENT' });
 *   const res = await app.inject({ headers: { authorization: `Bearer ${token}` }, ... });
 */
export async function createAuthToken(
  app: FastifyInstance,
  payload: { userId: string; role?: string } = { userId: 'test-user', role: 'STUDENT' },
): Promise<string> {
  // Ensure a test JWT secret exists
  if (!process.env.JWT_SECRET) process.env.JWT_SECRET = 'test-secret';

  // If the jwt decorator isn't present, register the auth plugin dynamically
  if (!(app as any).jwt) {
    // Import plugin dynamically so tests don't create circular imports at top-level
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const authPlugin = (await import('../../plugins/auth')).default;
    await app.register(authPlugin as any);
    await app.ready();
  }

  // Sign and return a token
  return (app as any).jwt.sign(payload);
}

export default createAuthToken;
