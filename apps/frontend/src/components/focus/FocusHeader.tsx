import { Box, Typography } from '@mui/material';

export default function FocusHeader({ totalMinutes }: { totalMinutes: number }) {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const year = today.getFullYear();
  const dateStr = `${month}.${day} ${year}`;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 4,
      }}
    >
      <Box>
        <Typography sx={{ fontSize: 24, fontWeight: 300, color: '#999' }}>
          {dateStr}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        <Box sx={{ textAlign: 'right' }}>
          <Typography sx={{ fontSize: 14, color: '#999', fontWeight: 500 }}>Total Focused Time</Typography>
          <Typography sx={{ fontSize: 48, fontWeight: 700, color: '#333' }}>
            {totalMinutes}
          </Typography>
          <Typography sx={{ fontSize: 14, color: '#999' }}>mins</Typography>
        </Box>
      </Box>
    </Box>
  );
}
