import Fastify from 'fastify';
import dotenv from 'dotenv';

import authPlugin from './plugins/auth';
import { corsPlugin } from './plugins/cors';

// routes
import { authRoutes } from './routes/auth';
import { meRoutes } from './routes/me';

import { adminChapterRoutes } from './routes/admin/chapters';
import { adminLessonRoutes } from './routes/admin/lessons';
import { adminCertificateRoutes } from './routes/admin/certificates';

import { chapterRoutes } from './routes/chapters';
import { lessonRoutes } from './routes/lessons';
import { lessonDetailRoutes } from './routes/lesson-detail';

import { lessonCompletionRoutes } from './routes/lesson-completion';
import { progressRoutes } from './routes/progress';

import { certificateRoutes } from './routes/certificate';
import { certificateVerificationRoutes } from './routes/certificate-verification';
import { certificateEmailRoutes } from './routes/certificate-email';

import { flashcardReviewRoutes } from './routes/flashcard-review';
import { flashcardsDueRoutes } from './routes/flashcards-due';

import { flashcardRoutes } from './modules/flashcards/flashcard.routes';
import { adminRoutes as adminModuleRoutes } from './modules/admin/admin.routes';

import { quizRoutes } from './routes/quiz';

dotenv.config();

const app = Fastify({ logger: true });

app.register(corsPlugin);
app.register(authPlugin);

// ✅ Auth
app.register(authRoutes, { prefix: '/api/auth' });
app.register(meRoutes, { prefix: '/api' });

// ✅ Student content
app.register(chapterRoutes, { prefix: '/api' });
app.register(lessonRoutes, { prefix: '/api' });
app.register(lessonDetailRoutes, { prefix: '/api' });

// ✅ Flashcards
app.register(flashcardRoutes, { prefix: '/api' });
app.register(flashcardReviewRoutes, { prefix: '/api' });
app.register(flashcardsDueRoutes, { prefix: '/api' });

// ✅ Progress + Certificate
app.register(lessonCompletionRoutes, { prefix: '/api' });
app.register(progressRoutes, { prefix: '/api' });

app.register(certificateRoutes, { prefix: '/api' });
app.register(certificateVerificationRoutes, { prefix: '/api' });
app.register(certificateEmailRoutes, { prefix: '/api' });

//quiz
app.register(quizRoutes, { prefix: '/api' });

// ✅ Admin
app.register(adminChapterRoutes, { prefix: '/api' });
app.register(adminLessonRoutes, { prefix: '/api' });
app.register(adminCertificateRoutes, { prefix: '/api' });
app.register(adminModuleRoutes, { prefix: '/api' });

// ✅ Health check
app.get('/', async () => ({
  name: 'Math Learning Platform API',
  status: 'running',
}));

const PORT = Number(process.env.PORT) || 3001;

app.listen({ port: PORT, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log(`🚀 Server running at ${address}`);
});
