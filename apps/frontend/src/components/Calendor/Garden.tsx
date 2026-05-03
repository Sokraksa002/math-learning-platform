import type { Plant } from '../../hook/useFocusData';
import { Box, Typography } from '@mui/material';

export default function Garden({ plants }: { plants: Plant[] }) {
  const emojiByType = {
    grass: '🌱',
    flower: '🌸',
    tree: '🌳',
  };

  return (
    <Box
      sx={{
        padding: 3,
        background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
        borderRadius: 4,
        minHeight: 400,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {(!plants || plants.length === 0) && (
        <Typography sx={{ fontSize: 16, color: '#666', textAlign: 'center' }}>
          🌱 Start a focus session to grow your garden
        </Typography>
      )}

      {plants && plants.length > 0 && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 60px)',
            gap: 2,
            justifyContent: 'center',
          }}
        >
          {plants.map((p: Plant) => (
            <Box
              key={p.id}
              sx={{
                fontSize: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'float 3s ease-in-out infinite',
                '@keyframes float': {
                  '0%, 100%': { transform: 'translateY(0px)' },
                  '50%': { transform: 'translateY(-10px)' },
                },
              }}
            >
              {emojiByType[p.type] || '🌱'}
            </Box>
          ))}
        </Box>
      )}

      <Typography
        sx={{
          fontSize: 20,
          fontWeight: 600,
          color: '#4caf50',
          marginTop: 3,
          letterSpacing: 1,
        }}
      >
        🌲 Forest
      </Typography>
    </Box>
  );
}