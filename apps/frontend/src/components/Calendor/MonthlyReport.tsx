import { Box, Typography } from '@mui/material';
import { useEmotionCalendar } from '../../hook/useEmotionCalendar';

export default function MonthlyReport() {
  const { calendar } = useEmotionCalendar();
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthLabel = now.toLocaleString(undefined, {
    month: 'short',
    year: 'numeric',
  });

  const emotions = Object.entries(calendar)
    .filter(([date]) => date.startsWith(month))
    .flatMap(([, e]) => e);

  const counts = emotions.reduce((acc, e) => {
    acc[e.label] = (acc[e.label] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dominant = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])[0];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg,#FFD1D6,#FFF)',
        p: 4,
        textAlign: 'center',
      }}
    >
      <Typography sx={{ fontSize: 18 }}>
        {monthLabel}
      </Typography>

      <Typography sx={{ fontSize: 36, fontWeight: 800 }}>
        Monthly Report
      </Typography>

      {dominant && (
        <Typography sx={{ fontSize: 18, mt: 2 }}>
          Dominant mood this month: <b>{dominant[0]}</b> ({dominant[1]} entries)
        </Typography>
      )}

      {!dominant && (
        <Typography sx={{ fontSize: 18, mt: 2 }}>
          No mood data yet for this month. Add your daily mood above.
        </Typography>
      )}
    </Box>
  );
}