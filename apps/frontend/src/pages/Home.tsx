import { Box } from '@mui/material';
import Header from '../components/Home/Header';
import HeroSection from '../components/Home/HeroSection';
import OurFunctionsSection from '../components/Home/OurFunctionsSection';
import MoodSection from '../components/Home/MoodSection';
import QuizTimeSection from '../components/Home/QuizTimeSection';
import ChapterSection from '../components/Home/ChapterSection';
import FlashcardSection from '../components/Home/FlashcardSection';

export default function Home() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
      }}
    >
      <Header />
      <HeroSection />
      <OurFunctionsSection />
      <MoodSection/>
      {/* Learning sections */}
      <QuizTimeSection />
      <ChapterSection />
      <FlashcardSection />
    </Box>
  );
}