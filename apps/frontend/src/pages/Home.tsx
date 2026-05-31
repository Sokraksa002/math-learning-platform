import HeroSection from "../components/Home/HeroSection";
import OurFunctionsSection from "../components/Home/OurFunctionsSection";
import EmotionCalendar from "../components/Home/EmotionCalendar";
import FocusTimeSection from "../components/Home/FocusTimeSection";
import LessonList from "../components/Lessons/LessonList";
import FlashcardSection from "../components/Home/FlashcardSection";
import { Box, Grid } from "@mui/material";

export default function Home() {
  return (
    <>
      <HeroSection />
      <OurFunctionsSection />

      <Box sx={{ px: { xs: 2, md: 4 }, pb: { xs: 2, md: 4 } }}>
        <Box sx={{ maxWidth: 1440, mx: "auto" }}>
          <Grid container spacing={3} alignItems="stretch">
            <Grid item xs={12} md={6}>
              <EmotionCalendar />
            </Grid>

            <Grid item xs={12} md={6}>
              <FocusTimeSection />
            </Grid>
          </Grid>
        </Box>
      </Box>

      <LessonList />
      <FlashcardSection />
    </>
  );
}