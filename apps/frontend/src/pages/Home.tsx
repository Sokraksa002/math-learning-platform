import HeroSection from "../components/Home/HeroSection";
import OurFunctionsSection from "../components/Home/OurFunctionsSection";
import DashboardLayout from "../components/Home/DashboardLayout";
import EmotionCalendar from "../components/Home/EmotionCalendar";
import QuizTimeSection from "../components/Home/QuizTimeSection";
import LessonList from "../components/Lessons/LessonList";
import FlashcardSection from "../components/Home/FlashcardSection";
import { isLoggedIn } from "../utils/auth";

export default function Home() {
  const loggedIn = isLoggedIn();
  return (
    <>
      <HeroSection />
      <OurFunctionsSection />
      <EmotionCalendar />
      <QuizTimeSection />
      <LessonList />
      <FlashcardSection />

      {loggedIn && (
        <>
          <DashboardLayout />
        </>
      )}
    </>
  );
}