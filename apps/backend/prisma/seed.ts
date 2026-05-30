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
        role: u.role as any,
        isBanned: u.isBanned,
      },
      create: {
        name: u.name,
        email: u.email,
        passwordHash: u.passwordHash,
        role: u.role as any,
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

  // ================= LESSON (AUTO-LOAD JSON ✅) =================
  async function ensureLesson(chapterId: string, titleKm: string, orderIndex: number, key: string) {
    let lesson = await prisma.lesson.findFirst({
      where: { titleKm, chapterId },
    });

    let contentJson: any = { blocks: [] };

    try {
      const filePath = path.join(__dirname, `../data/lessons/${key}.json`);

      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(raw);

        // ✅ SUPPORT BOTH formats
        if (parsed.blocks) {
          contentJson = { blocks: parsed.blocks };
        } else if (parsed.content?.blocks) {
          contentJson = { blocks: parsed.content.blocks };
        }

        console.log(`✅ Loaded JSON for ${key}`);
      } else {
        console.log(`⚠️ No JSON file for ${key}`);
      }
    } catch (err) {
      console.log(`❌ Error loading JSON for ${key}`);
    }

    if (!lesson) {
      lesson = await prisma.lesson.create({
        data: {
          chapterId,
          titleKm,
          orderIndex,
          isPublished: true,
          contentJson,
        },
      });

      console.log('✅ Created lesson:', lesson.titleKm);
    } else {
      // ✅ update existing lesson with new JSON
      await prisma.lesson.update({
        where: { id: lesson.id },
        data: { contentJson },
      });

      console.log('♻️ Updated lesson:', lesson.titleKm);
    }

    return lesson;
  }

  // ================= CREATE CHAPTER =================
  const chapter = await ensureChapter('Grade 12 Mathematics', 1);

  // ================= LESSON MAP =================
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
    const lesson = await ensureLesson(
      chapter.id,
      `Lesson ${index} - ${lessonMap[key]}`,
      index,
      key, // ✅ IMPORTANT
    );

    lessonCache[key] = lesson.id;
    index++;
  }

  // ================= EXERCISES =================
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
        } catch {
          console.log(`❌ Invalid JSON in ${file}`);
          continue;
        }

        const questions = Array.isArray(data) ? data : data.questions || [];

        for (const item of questions) {
          if (!item.question || !item.answer) continue;

          try {
            await prisma.exercise.create({
              data: {
                lessonId,
                questionKm: item.question,
                solutionKm: item.solution || '',
                correctAnswer: String(item.answer),
              },
            });
          } catch {
            console.log('⚠️ Skip duplicate:', item.question);
          }
        }
      }

      console.log(`✅ Seeded exercises: ${folder}`);
    }
  }

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
