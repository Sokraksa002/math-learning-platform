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
      role: 'STUDENT',
      isBanned: false,
    },
    {
      email: 'admin@example.com',
      name: 'Admin',
      role: 'ADMIN',
      isBanned: false,
    },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {
        name: u.name,
        passwordHash,
        role: u.role as any,
        isBanned: u.isBanned,
      },
      create: {
        name: u.name,
        email: u.email,
        passwordHash,
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
      console.log('✅ Created chapter:', titleKm);
    }

    return ch;
  }

  // ================= LESSON =================
  async function ensureLesson(chapterId: string, titleKm: string, orderIndex: number, key: string) {
    let lesson = await prisma.lesson.findFirst({
      where: { titleKm, chapterId },
    });

    let contentJson: any = { blocks: [] };

    try {
      const filePath = path.join(process.cwd(), `data/lessons/${key}.json`);

      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(raw);

        if (parsed.blocks) {
          contentJson = { blocks: parsed.blocks };
        } else if (parsed.content?.blocks) {
          contentJson = { blocks: parsed.content.blocks };
        }

        console.log(`✅ Loaded lesson JSON: ${key}`);
      }
    } catch {
      console.log(`❌ Error loading lesson JSON: ${key}`);
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

      console.log('✅ Created lesson:', titleKm);
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
      key,
    );

    lessonCache[key] = lesson.id;
    index++;
  }

  // ================= EXERCISES =================
  async function seedExercises() {
    const basePath = path.join(process.cwd(), 'data/exercises');

    console.log('📂 Reading exercises from:', basePath);

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

      let count = 0;

      for (const file of files) {
        const filePath = path.join(folderPath, file);

        try {
          const raw = fs.readFileSync(filePath, 'utf-8');
          const data = JSON.parse(raw);

          const questions = Array.isArray(data) ? data : data.exercises || data.questions || [];

          for (const item of questions) {
            if (!item.question || !item.choices || item.correctIndex === undefined) {
              continue;
            }

            try {
              await prisma.exercise.create({
                data: {
                  lessonId,
                  questionKm: item.question,
                  solutionKm: item.explanation || '',
                  correctAnswer: item.choices[item.correctIndex],
                  choices: item.choices,
                },
              });

              count++;
            } catch {
              // skip duplicates
            }
          }
        } catch {
          console.log(`❌ Invalid JSON: ${file}`);
        }
      }

      console.log(`✅ ${folder}: inserted ${count} questions`);
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
