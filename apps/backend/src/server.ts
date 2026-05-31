import Fastify from 'fastify';
import dotenv from 'dotenv';

import authPlugin from './plugins/auth';
import { corsPlugin } from './plugins/cors';

// routes
import { authRoutes } from './modules/auth/auth.routes';
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

// ✅ FLASHCARD ROUTES
import { flashcardReviewRoutes } from './routes/flashcard-review';
import { flashcardsDueRoutes } from './routes/flashcards-due';
import { aiFlashcardRoutes } from './routes/ai.flashcards'; // ✅ ✅ ADD THIS
import { aiDebugRoutes } from './routes/ai.debug';

import { flashcardRoutes } from './modules/flashcards/flashcard.routes';
import { adminRoutes as adminModuleRoutes } from './modules/admin/admin.routes';

import { quizRoutes } from './routes/quiz';

dotenv.config();

// Startup check for AI configuration (will run after `app` is created)
function checkAiConfig() {
  const mock = process.env.MOCK_AI === 'true';
  const project = process.env.GCP_PROJECT_ID;
  const region = process.env.GCP_REGION;
  const creds = process.env.GOOGLE_APPLICATION_CREDENTIALS;

  console.log('=== AI CONFIG DEBUG ===');
  console.log('MOCK_AI:', process.env.MOCK_AI);
  console.log('Credentials:', process.env.GOOGLE_APPLICATION_CREDENTIALS);
  console.log('Project:', process.env.GCP_PROJECT_ID);
  console.log('Region:', process.env.GCP_REGION);
  console.log('=======================');
  if (mock) {
    // eslint-disable-next-line no-console
    console.info('MOCK_AI=true — skipping AI provider config checks');
    return;
  }

  const missing: string[] = [];
  if (!project) missing.push('GCP_PROJECT_ID');
  if (!region) missing.push('GCP_REGION');
  if (!creds) missing.push('GOOGLE_APPLICATION_CREDENTIALS');

  if (missing.length > 0) {
    // when called after app is created, prefer app.log; otherwise console
    const logger = typeof app !== 'undefined' && app?.log ? app.log : console;
    logger.error('Missing Google Cloud AI configuration: ' + missing.join(', '));
    logger.error(
      'To fix: set the required environment variables or enable MOCK_AI for local development.',
    );
    logger.error(
      'Example (macOS):\n  export GCP_PROJECT_ID=your-project-id\n  export GCP_REGION=us-central1\n  export GOOGLE_APPLICATION_CREDENTIALS=$HOME/keys/vertex-ai-sa-key.json',
    );
    if (process.env.NODE_ENV === 'production') {
      logger.error('Running in production without AI config — exiting.');
      process.exit(1);
    } else {
      logger.warn(
        'Continuing in development: server will start but AI features will be disabled unless MOCK_AI=true.',
      );
    }
  }
}

const app = Fastify({ logger: true });

app.register(corsPlugin);
app.register(authPlugin);

// ✅ Auth
app.register(authRoutes, { prefix: '/api' });
app.register(meRoutes, { prefix: '/api' });

// ✅ Student content
app.register(chapterRoutes, { prefix: '/api' });
app.register(lessonRoutes, { prefix: '/api' });
app.register(lessonDetailRoutes, { prefix: '/api' });

// ✅ ✅ FLASHCARDS (FINAL FIX SECTION)
app.register(flashcardRoutes, { prefix: '/api' });
app.register(flashcardReviewRoutes, { prefix: '/api' });
app.register(flashcardsDueRoutes, { prefix: '/api' });

// Dev-only AI debug endpoint
app.register(aiDebugRoutes, { prefix: '/api' });

// Move the AI config check after app creation
checkAiConfig();
app.register(aiFlashcardRoutes, { prefix: '/api' });

// ✅ Progress + Certificate
app.register(lessonCompletionRoutes, { prefix: '/api' });
app.register(progressRoutes, { prefix: '/api' });

app.register(certificateRoutes, { prefix: '/api' });
app.register(certificateVerificationRoutes, { prefix: '/api' });
app.register(certificateEmailRoutes, { prefix: '/api' });

// ✅ Quiz
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
