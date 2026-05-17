/*
  Warnings:

  - You are about to drop the column `question_id` on the `quiz_session_items` table. All the data in the column will be lost.
  - You are about to drop the `quiz_questions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `exercise_id` to the `quiz_session_items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "quiz_questions" DROP CONSTRAINT "quiz_questions_lesson_id_fkey";

-- DropForeignKey
ALTER TABLE "quiz_session_items" DROP CONSTRAINT "quiz_session_items_question_id_fkey";

-- AlterTable
ALTER TABLE "quiz_session_items" DROP COLUMN "question_id",
ADD COLUMN     "exercise_id" UUID NOT NULL;

-- DropTable
DROP TABLE "quiz_questions";

-- CreateTable
CREATE TABLE "exercises" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "lesson_id" UUID NOT NULL,
    "question_km" TEXT NOT NULL,
    "solution_km" TEXT NOT NULL,
    "correct_answer" TEXT NOT NULL,
    "external_id" TEXT,
    "difficulty" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exercises_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "quiz_session_items" ADD CONSTRAINT "quiz_session_items_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
