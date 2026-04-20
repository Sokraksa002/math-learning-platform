/*
  Warnings:

  - You are about to drop the column `score` on the `certificates` table. All the data in the column will be lost.
  - You are about to drop the `activity-event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `chapter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `flashcard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lesson` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lesson_exercise` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `quiz-session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `quiz_question` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `quiz_sessionItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `average_score` to the `certificates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_lessons` to the `certificates` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "activity-event" DROP CONSTRAINT "activity-event_user_id_fkey";

-- DropForeignKey
ALTER TABLE "certificates" DROP CONSTRAINT "certificates_user_id_fkey";

-- DropForeignKey
ALTER TABLE "flashcard" DROP CONSTRAINT "flashcard_lesson_id_fkey";

-- DropForeignKey
ALTER TABLE "flashcard" DROP CONSTRAINT "flashcard_user_id_fkey";

-- DropForeignKey
ALTER TABLE "lesson" DROP CONSTRAINT "lesson_chapter_id_fkey";

-- DropForeignKey
ALTER TABLE "lesson_exercise" DROP CONSTRAINT "lesson_exercise_lesson_id_fkey";

-- DropForeignKey
ALTER TABLE "quiz-session" DROP CONSTRAINT "quiz-session_lesson_id_fkey";

-- DropForeignKey
ALTER TABLE "quiz-session" DROP CONSTRAINT "quiz-session_user_id_fkey";

-- DropForeignKey
ALTER TABLE "quiz_question" DROP CONSTRAINT "quiz_question_lesson_id_fkey";

-- DropForeignKey
ALTER TABLE "quiz_sessionItem" DROP CONSTRAINT "quiz_sessionItem_question_id_fkey";

-- DropForeignKey
ALTER TABLE "quiz_sessionItem" DROP CONSTRAINT "quiz_sessionItem_session_id_fkey";

-- AlterTable
ALTER TABLE "certificates" DROP COLUMN "score",
ADD COLUMN     "average_score" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "total_lessons" INTEGER NOT NULL;

-- DropTable
DROP TABLE "activity-event";

-- DropTable
DROP TABLE "chapter";

-- DropTable
DROP TABLE "flashcard";

-- DropTable
DROP TABLE "lesson";

-- DropTable
DROP TABLE "lesson_exercise";

-- DropTable
DROP TABLE "quiz-session";

-- DropTable
DROP TABLE "quiz_question";

-- DropTable
DROP TABLE "quiz_sessionItem";

-- DropTable
DROP TABLE "user";

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" CITEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chapters" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title_km" TEXT NOT NULL,
    "order_index" INTEGER NOT NULL,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chapters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lessons" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "chapter_id" UUID NOT NULL,
    "title_km" TEXT NOT NULL,
    "order_index" INTEGER NOT NULL,
    "content_json" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lesson_completions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "lesson_id" UUID NOT NULL,
    "completed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lesson_completions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_questions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "lesson_id" UUID NOT NULL,
    "question_km" TEXT NOT NULL,
    "choice_a_km" TEXT NOT NULL,
    "choice_b_km" TEXT NOT NULL,
    "choice_c_km" TEXT NOT NULL,
    "choice_d_km" TEXT NOT NULL,
    "correct_choice" TEXT NOT NULL,
    "solution_km" TEXT NOT NULL,
    "difficulty" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quiz_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_sessions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "lesson_id" UUID NOT NULL,
    "score" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quiz_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_session_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "session_id" UUID NOT NULL,
    "question_id" UUID NOT NULL,
    "selected_choice" TEXT,
    "is_correct" BOOLEAN,

    CONSTRAINT "quiz_session_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flashcards" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "chapter_id" UUID NOT NULL,
    "deck_id" UUID,
    "question_km" TEXT NOT NULL,
    "answer_json" JSONB NOT NULL,
    "is_user_generated" BOOLEAN NOT NULL DEFAULT false,
    "interval" INTEGER NOT NULL DEFAULT 1,
    "ease_factor" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "next_review_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total_reviews" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "flashcards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flashcard_reviews" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "flashcard_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "rating" TEXT NOT NULL,
    "interval" INTEGER NOT NULL,
    "reviewed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "flashcard_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "decks" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "chapter_id" UUID,
    "name_km" TEXT NOT NULL,
    "card_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "decks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_progress" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "lesson_id" UUID NOT NULL,
    "mastery_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_attempts" INTEGER NOT NULL DEFAULT 0,
    "correct_count" INTEGER NOT NULL DEFAULT 0,
    "accuracy_rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "last_studied_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_events" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "event_type" TEXT NOT NULL,
    "entity" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "lesson_completions_user_id_lesson_id_key" ON "lesson_completions"("user_id", "lesson_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_progress_user_id_lesson_id_key" ON "user_progress"("user_id", "lesson_id");

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "chapters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_completions" ADD CONSTRAINT "lesson_completions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_completions" ADD CONSTRAINT "lesson_completions_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_questions" ADD CONSTRAINT "quiz_questions_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_sessions" ADD CONSTRAINT "quiz_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_sessions" ADD CONSTRAINT "quiz_sessions_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_session_items" ADD CONSTRAINT "quiz_session_items_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "quiz_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_session_items" ADD CONSTRAINT "quiz_session_items_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "quiz_questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flashcards" ADD CONSTRAINT "flashcards_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flashcards" ADD CONSTRAINT "flashcards_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "chapters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flashcards" ADD CONSTRAINT "flashcards_deck_id_fkey" FOREIGN KEY ("deck_id") REFERENCES "decks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flashcard_reviews" ADD CONSTRAINT "flashcard_reviews_flashcard_id_fkey" FOREIGN KEY ("flashcard_id") REFERENCES "flashcards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flashcard_reviews" ADD CONSTRAINT "flashcard_reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decks" ADD CONSTRAINT "decks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decks" ADD CONSTRAINT "decks_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "chapters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_events" ADD CONSTRAINT "activity_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
