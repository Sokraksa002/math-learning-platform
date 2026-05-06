// src/pages/focus/index.tsx

import { Box, Grid } from '@mui/material';
import FocusHeader from '../components/focus/FocusHeader';
import FocusTimer from '../components/Calendor/FocusTimer';
import Garden from '../components/Calendor/Garden';
import FocusChart from '../components/Calendor/FocusChart';
import { useFocusData } from '../hook/useFocusData';
import { useLocale } from '../hooks/useLocale';

export default function FocusPage() {
  const { t } = useLocale();
  const { plants, totalMinutes, hourlyFocus, addFocusSession } = useFocusData();

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', padding: 4 }}>
      <Box sx={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <FocusHeader totalMinutes={totalMinutes} />

        {/* Main Layout: Garden + Chart */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {/* Garden Column */}
          <Grid item xs={12} md={6}>
            <Garden plants={plants} />
          </Grid>

          {/* Chart Column */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                backgroundColor: 'white',
                borderRadius: 4,
                padding: 3,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              <Box sx={{ fontSize: 14, fontWeight: 600, color: '#999', mb: 2 }}>{t('pages.Focus.focused_time_distribution', 'Focused Time Distribution')}</Box>
              <FocusChart data={hourlyFocus} />
            </Box>
          </Grid>
        </Grid>

        {/* Timer Section */}
        <Box
          sx={{
            backgroundColor: 'white',
            borderRadius: 4,
            padding: 4,
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <FocusTimer onFinish={addFocusSession} />
        </Box>
      </Box>
    </Box>
  );
}