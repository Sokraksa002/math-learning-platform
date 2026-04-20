import { FastifyInstance } from "fastify";
import * as controller from "./auth.controller";

export async function authRoutes(app: FastifyInstance) {
  app.post("/auth/register", controller.register);
  app.post("/auth/login", controller.login);
  app.get(
    "/auth/me",
    { preHandler: app.authenticate },
    controller.me
  );
}