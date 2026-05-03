import { Box, Typography, Button } from '@mui/material';
import { useEmotionCalendar } from '../../hook/useEmotionCalendar';
import type { EmotionLabel } from '../../hook/useEmotionCalendar';

const moods: { label: EmotionLabel; emoji: string }[] = [
  { label: 'Awful', emoji: '😡' },
  { label: 'Bad', emoji: '😕' },
  { label: 'Neutral', emoji: '😐' },
  { label: 'Good', emoji: '🙂' },
  { label: 'Great', emoji: '😄' },
];

export default function MoodBottle() {
  const {
    selectedDate,
    setSelectedDate,
    addEmotion,
    emotionsOfSelectedDate,
  } = useEmotionCalendar();

  const selectedMood = emotionsOfSelectedDate.at(-1)?.emoji;

  const handleMoodClick = (emoji: string) => {
    const mood = moods.find((item) => item.emoji === emoji);
    if (!mood) return;

    addEmotion(emoji, mood.label);
  };

  return (
    <Box
      sx={{
        width: 360,
        height: 680,
        borderRadius: '48px',
        background: 'linear-gradient(180deg, #EAF3FF, #DDEBFF)',
        mx: 'auto',
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 30px 60px rgba(0,0,0,0.15)',
      }}
    >
      {/* Date selector */}
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        style={{
          padding: '10px',
          borderRadius: '12px',
          border: 'none',
          fontSize: '16px',
        }}
      />

      {/* Bottle area */}
      <Box
        sx={{
          flex: 1,
          mt: 3,
          borderRadius: '36px',
          background:
            'linear-gradient(180deg, #F5FAFF, #E8F2FF)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '80px',
        }}
      >
        {selectedMood ?? '🫧'}
      </Box>

      {/* Emojis */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        {moods.map((mood) => (
          <Button
            key={mood.label}
            onClick={() => handleMoodClick(mood.emoji)}
            sx={{
              minWidth: 0,
              flexDirection: 'column',
              fontSize: '24px',
            }}
          >
            {mood.emoji}
            <Typography sx={{ fontSize: '12px' }}>
              {mood.label}
            </Typography>
          </Button>
        ))}
      </Box>
    </Box>
  );
}