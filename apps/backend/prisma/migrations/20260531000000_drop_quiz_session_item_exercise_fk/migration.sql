-- Drop the quiz-only foreign key so quiz session items can store the JSON quiz exercise id.
ALTER TABLE "quiz_session_items" DROP CONSTRAINT "quiz_session_items_exercise_id_fkey";