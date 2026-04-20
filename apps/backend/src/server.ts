import Fastify from "fastify";
import dotenv from "dotenv";

import authPlugin from "./plugins/auth";
import { corsPlugin } from "./plugins/cors";
import { authRoutes } from "./routes/auth";

dotenv.config();

const app = Fastify({ logger: true });

app.register(corsPlugin);
app.register(authPlugin);

app.register(authRoutes, { prefix: "/api/auth" });

app.get("/", async () => ({
  name: "Math Learning Platform API",
  status: "running",
}));

const PORT = Number(process.env.PORT) || 3001;

app.listen({ port: PORT, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log(`🚀 Server running at ${address}`);
});