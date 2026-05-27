import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { prisma } from '../src/lib/prisma';
import fs from 'fs';
import path from 'path';

async function main() {
  // ================= USERS =================
  const password = 'password123';
  const passwordHash = await bcrypt.hash(password, 10);

  const users = [
    {
      email: 'student1@example.com',
      name: 'Student One',
      passwordHash,
      role: 'STUDENT',
      isBanned: false,
    },
    {
      email: 'admin@example.com',
      name: 'Admin',
      passwordHash,
      role: 'ADMIN',
      isBanned: false,
    },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {
        name: u.name,
        passwordHash: u.passwordHash,
        role: (u as any).role,
        isBanned: u.isBanned,
      },
      create: {
        name: u.name,
        email: u.email,
        passwordHash: u.passwordHash,
        role: (u as any).role,
        isBanned: u.isBanned,
      },
    });
  }

  // ================= CHAPTER =================
  async function ensureChapter(titleKm: string, orderIndex: number) {
    let ch = await prisma.chapter.findFirst({ where: { titleKm } });
    if (!ch) {
      ch = await prisma.chapter.create({
        data: {
          titleKm,
          orderIndex,
          isPublished: true,
        },
      });
      console.log('✅ Created chapter:', ch.titleKm);
    }
    return ch;
  }

  // ================= LESSON =================
  async function ensureLesson(chapterId: string, titleKm: string, orderIndex: number) {
    let l = await prisma.lesson.findFirst({
      where: { titleKm, chapterId },
    });

    if (!l) {
      l = await prisma.lesson.create({
        data: {
          chapterId,
          titleKm,
          orderIndex,
          isPublished: true,
          contentJson: {},
        },
      });
      console.log('✅ Created lesson:', l.titleKm);
    }

    return l;
  }

  // ✅ Create ONE main chapter (Grade 12)
  const chapter = await ensureChapter('Grade 12 Mathematics', 1);

  // ✅ Map folders → lesson names
  const lessonMap: Record<string, string> = {
    'grade12-complex': 'Complex Numbers',
    'grade12-conics': 'Conic Sections',
    'grade12-derivatives': 'Derivatives',
    'grade12-differential': 'Differential Equations',
    'grade12-functions': 'Functions',
    'grade12-integrals': 'Integrals',
    'grade12-limits': 'Limits',
    'grade12-probability': 'Probability',
  };

  const lessonCache: Record<string, string> = {};

  let index = 1;

  for (const key in lessonMap) {
    const lesson = await ensureLesson(chapter.id, `Lesson ${index} - ${lessonMap[key]}`, index);
    lessonCache[key] = lesson.id;
    index++;
  }

  // ================= SEED EXERCISES =================
  async function seedExercises() {
    const basePath = path.join(__dirname, '../data/exercises');

    if (!fs.existsSync(basePath)) {
      console.log('❌ data/exercises folder not found');
      return;
    }

    const folders = fs.readdirSync(basePath);

    for (const folder of folders) {
      const lessonId = lessonCache[folder];

      if (!lessonId) {
        console.log(`⚠️ No lesson mapping for ${folder}`);
        continue;
      }

      const folderPath = path.join(basePath, folder);
      const files = fs.readdirSync(folderPath);

      for (const file of files) {
        const filePath = path.join(folderPath, file);

        const raw = fs.readFileSync(filePath, 'utf-8');

        let data;
        try {
          data = JSON.parse(raw);
        } catch (err) {
          console.log(`❌ Invalid JSON in ${file}`);
          continue;
        }

        // ✅ Support both formats:
        // [{...}, {...}] OR { questions: [...] }
        const questions = Array.isArray(data) ? data : data.questions || [];

        for (const item of questions) {
          if (!item.question || !item.answer) continue;

          try {
            await prisma.exercise.upsert({
              where: {
                id: item.id || 'skip', // fallback to avoid crash
              },
              update: {},
              create: {
                lessonId,
                questionKm: item.question,
                solutionKm: item.solution || '',
                correctAnswer: String(item.answer),
              },
            });
          } catch (err) {
            console.log('⚠️ Skip duplicate:', item.question);
          }
        }
      }

      console.log(`✅ Seeded: ${folder}`);
    }
  }

  // ✅ RUN exercise seeding
  await seedExercises();

  console.log('\n🚀 SEED COMPLETE ✅');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
