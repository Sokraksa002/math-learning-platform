import { useState } from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const moods = [
  { emoji: '😢', label: 'Bad', color: '#FF6B6B' },
  { emoji: '😕', label: 'Sad', color: '#FFA500' },
  { emoji: '😊', label: 'Happy', color: '#FFD700' },
  { emoji: '😢', label: 'Okay', color: '#87CEEB' },
  { emoji: '😄', label: 'Great', color: '#90EE90' },
];

const motivationalMessages = [
  "Just keep going! I know you can do it",
  "You're doing great! Keep it up!",
  "Every step counts. Stay motivated!",
  "Believe in yourself!",
  "You've got this! 💪",
];

export default function CalendarComponent() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedMood, setSelectedMood] = useState<number | null>(null);

  return (
    <Box sx={{ p: 6, maxWidth: '1200px', mx: 'auto' }}>
      <Typography sx={{ fontWeight: 700, fontSize: '20px', textAlign: 'center', color: '#2c3e50', mb: 4 }}>
        What about your mood for today?
      </Typography>

      <Grid container spacing={4} sx={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'flex-start' }}>
        {/* Calendar */}
        <Grid sx={{ flex: 1, minWidth: 0 }}>
          <Paper sx={{ p: 4, backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Calendar
                onChange={(value) => {
                  if (value instanceof Date) {
                    setSelectedDate(value);
                    return;
                  }

                  if (Array.isArray(value) && value[0] instanceof Date) {
                    setSelectedDate(value[0]);
                  }
                }}
                value={selectedDate}
                className="custom-calendar"
                tileClassName={({ date, view }: { date: Date; view: string }) => {
                  if (view === 'month') {
                    const today = new Date();
                    if (
                      date.getDate() === today.getDate() &&
                      date.getMonth() === today.getMonth() &&
                      date.getFullYear() === today.getFullYear()
                    ) {
                      return 'today';
                    }
                  }
                  return '';
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Mood Selector */}
        <Grid sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, height: '100%' }}>
            {/* Mood Emojis */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              {moods.map((mood, index) => (
                <Box
                  key={index}
                  onClick={() => setSelectedMood(index)}
                  sx={{
                    fontSize: '52px',
                    cursor: 'pointer',
                    opacity: selectedMood === index ? 1 : 0.6,
                    transform: selectedMood === index ? 'scale(1.3)' : 'scale(1)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'scale(1.25)',
                      opacity: 1,
                    },
                  }}
                >
                  {mood.emoji}
                </Box>
              ))}
            </Box>

            {/* Motivational Message */}
            {selectedMood !== null && (
              <Paper
                sx={{
                  p: 4,
                  backgroundColor: '#FFE8EC',
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  textAlign: 'center',
                  animation: 'slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '@keyframes slideIn': {
                    from: { opacity: 0, transform: 'translateY(-15px)' },
                    to: { opacity: 1, transform: 'translateY(0)' },
                  },
                }}
              >
                <Typography sx={{ fontWeight: 600, color: '#2c3e50', fontSize: '16px', lineHeight: 1.6 }}>
                  {motivationalMessages[selectedMood % motivationalMessages.length]}
                </Typography>
              </Paper>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
