import Fastify from "fastify";
import dotenv from "dotenv";

import authPlugin from "./plugins/auth";
import { corsPlugin } from "./plugins/cors";
import { authRoutes } from "./routes/auth";
import { meRoutes } from "./routes/me";
import { adminRoutes } from "./routes/admin";
import { adminChapterRoutes } from "./routes/admin/chapters";
import { chapterRoutes } from "./routes/chapters";
import { lessonRoutes } from "./routes/lessons";
import { adminLessonRoutes } from "./routes/admin/lessons";
import { lessonDetailRoutes } from "./routes/lesson-detail";
import { lessonCompletionRoutes } from "./routes/lesson-completion";
import { progressRoutes } from "./routes/progress";
import { certificateRoutes } from "./routes/certificate";
import { certificateVerificationRoutes } from "./routes/certificate-verification";
import { adminCertificateRoutes } from "./routes/admin/certificates";
import { certificateEmailRoutes } from "./routes/certificate-email";
import { flashcardReviewRoutes } from "./routes/flashcard-review";
import { flashcardsDueRoutes } from "./routes/flashcards-due";
import { flashcardRoutes } from "./modules/flashcards/flashcard.routes";
import { adminRoutes } from "./modules/admin/admin.routes";


dotenv.config();

const app = Fastify({ logger: true });

app.register(corsPlugin);
app.register(authPlugin);

app.register(authRoutes, { prefix: "/api/auth" });
app.register(meRoutes, { prefix: "/api" });
app.register(adminRoutes, { prefix: "/api" });
// Student content
app.register(chapterRoutes, { prefix: "/api" });
app.register(lessonRoutes, { prefix: "/api" });
app.register(lessonDetailRoutes, { prefix: "/api" });
app.register(flashcardReviewRoutes, { prefix: "/api" });
app.register(flashcardsDueRoutes, { prefix: "/api" });
app.register(flashcardRoutes, { prefix: "/api" });
// Student progress
app.register(lessonCompletionRoutes, { prefix: "/api" });
app.register(progressRoutes, { prefix: "/api" });
app.register(certificateRoutes, { prefix: "/api" });
app.register(certificateVerificationRoutes, { prefix: "/api" });
app.register(certificateEmailRoutes, { prefix: "/api" });

// Admin content management
app.register(adminChapterRoutes, { prefix: "/api" });
app.register(adminLessonRoutes, { prefix: "/api" });  // admin: lessons
app.register(adminCertificateRoutes, { prefix: "/api" });  // admin: certificates
app.register(adminRoutes, { prefix: "/api" });


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