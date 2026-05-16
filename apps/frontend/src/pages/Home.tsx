import HeroSection from "../components/Home/HeroSection";
import OurFunctionsSection from "../components/Home/OurFunctionsSection";
import DashboardLayout from "../components/Home/DashboardLayout";
import EmotionCalendar from "../components/Home/EmotionCalendar";
import QuizTimeSection from "../components/Home/QuizTimeSection";
import ChapterSection from "../components/Home/ChapterSection";
import FlashcardSection from "../components/Home/FlashcardSection";
import { isLoggedIn } from "../utils/auth";

export default function Home() {
  const loggedIn = isLoggedIn();
 
  return (
    <>
      {/* ✅ BEFORE LOGIN → Landing Page */}
      {!loggedIn && (
        <>
          <HeroSection />
          <OurFunctionsSection />
          <EmotionCalendar />
          <QuizTimeSection />
          <ChapterSection />
          <FlashcardSection />
        </>
      )}

      {/* ✅ AFTER LOGIN → Dashboard */}
      {loggedIn && (
        <>

        <DashboardLayout />
        <EmotionCalendar />
        </>
      )}
    </>
  );
}