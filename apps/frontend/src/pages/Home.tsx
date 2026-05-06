import { Box } from "@mui/material";
import Header from "../components/Home/Header";
import HeroSection from "../components/Home/HeroSection";
import OurFunctionsSection from "../components/Home/OurFunctionsSection";
import MoodSection from "../components/Home/MoodSection";
import QuizTimeSection from "../components/Home/QuizTimeSection";
import ProgressChart from "../components/Home/ProgressChart";
import EmotionCalendar from "../components/Home/EmotionCalendar";
import ChapterSection from "../components/Home/ChapterSection";
import FlashcardSection from "../components/Home/FlashcardSection";
import { isLoggedIn } from "../utils/auth";

export default function Home() {
  const loggedIn = isLoggedIn();
 
  return (
    <Box  
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
      }}
    >
      <Header />

      {/* ✅ BEFORE LOGIN → Landing Page */}
      {!loggedIn && (
        <>
          <HeroSection />
          <OurFunctionsSection />
          <EmotionCalendar />
          <MoodSection />
          <QuizTimeSection />
          <ChapterSection />
          <FlashcardSection />
        </>
      )}

      {/* ✅ AFTER LOGIN → Dashboard */}
      {loggedIn && (
        <>
          <ProgressChart />
          <MoodSection />
          <EmotionCalendar />
          <QuizTimeSection />
          <ChapterSection />
          <FlashcardSection />
        </>
      )}
    </Box>
  );
}