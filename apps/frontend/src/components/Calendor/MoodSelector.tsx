import { Box, Button, Typography } from '@mui/material';
import type { EmotionLabel } from '../../hook/useEmotionCalendar';

const moods: { emoji: string; label: EmotionLabel }[] = [
  { emoji: '😡', label: 'Awful' },
  { emoji: '😕', label: 'Bad' },
  { emoji: '😐', label: 'Neutral' },
  { emoji: '🙂', label: 'Good' },
  { emoji: '😄', label: 'Great' },
];

export default function MoodSelector({
  onSelect,
}: {
  onSelect: (emoji: string, label: EmotionLabel) => void;
}) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
      {moods.map(m => (
        <Button
          key={m.label}
          onClick={() => onSelect(m.emoji, m.label)}
          sx={{ flexDirection: 'column', minWidth: 0 }}
        >
          <span style={{ fontSize: 26 }}>{m.emoji}</span>
          <Typography sx={{ fontSize: 12 }}>{m.label}</Typography>
        </Button>
      ))}
    </Box>
  );
}
