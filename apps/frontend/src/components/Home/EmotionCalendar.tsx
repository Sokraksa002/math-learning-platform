import { useState, useEffect } from "react";
import { useLocale } from '../../hooks/useLocale';
import {
  Box,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

interface EmotionData {
  [key: string]: { emotion: string; note: string };
}

const emotions = [
  { emoji: "😊", label: "Happy", color: "#FFD93D" },
  { emoji: "😐", label: "Neutral", color: "#A8D8EA" },
  { emoji: "😔", label: "Sad", color: "#AA96DA" },
  { emoji: "😣", label: "Stressed", color: "#FCBAD3" },
  { emoji: "🔥", label: "Excited", color: "#FF6B6B" },
];

export default function EmotionCalendar() {
  const { t } = useLocale();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4));
  const [emotionData, setEmotionData] = useState<EmotionData>({});
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<string>("😊");
  const [note, setNote] = useState("");
  // animatedDates removed — compact UI does not use per-day animation

  useEffect(() => {
    const saved = localStorage.getItem("emotionCalendar");
    if (saved) {
      try {
        setEmotionData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load emotion data", e);
      }
    }
  }, []);

  const saveData = (newData: EmotionData) => {
    localStorage.setItem("emotionCalendar", JSON.stringify(newData));
    setEmotionData(newData);
  };

  const handleDateClick = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${day}`;
    setSelectedDate(dateStr);
    if (emotionData[dateStr]) {
      setSelectedEmotion(emotionData[dateStr].emotion);
      setNote(emotionData[dateStr].note);
    } else {
      setSelectedEmotion("😊");
      setNote("");
    }
    setOpenDialog(true);
  };

  const handleSaveEmotion = () => {
    if (selectedDate) {
      const newData = { ...emotionData };
      newData[selectedDate] = { emotion: selectedEmotion, note };
      saveData(newData);
      // no animation for compact view
    }
    setOpenDialog(false);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getDaysInMonth = () => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = () => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth();
  const firstDay = getFirstDayOfMonth();
  const days: (number | null)[] = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const emotionCount = Object.keys(emotionData).length;
  const emptyCount = Math.max(daysInMonth - emotionCount, 0);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <Paper
      sx={{
        p: { xs: 1.25, md: 2 },
        mt: 2.5,
        borderRadius: 3.5,
        background: "#ffffff",
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
        border: "1px solid rgba(226, 232, 240, 0.95)",
        animation: "slideInUp 0.5s ease-out",
        "@keyframes slideInUp": {
          from: { opacity: 0, transform: "translateY(10px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 2,
          mb: 2,
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <Box>
          <Typography sx={{ fontWeight: 900, fontSize: { xs: 17, md: 22 }, letterSpacing: -0.35 }}>
            Week: {monthNames[currentDate.getMonth()]}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: { xs: '100%', md: 'auto' }, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
            <Button variant="text" onClick={handlePrevMonth} sx={{ minWidth: 24, height: 28, borderRadius: 999, color: '#64748b', fontWeight: 900, px: 0.6 }}>‹</Button>
            <Button variant="text" onClick={handleNextMonth} sx={{ minWidth: 24, height: 28, borderRadius: 999, color: '#64748b', fontWeight: 900, px: 0.6 }}>›</Button>
          </Box>

          <TextField
            size="small"
            placeholder="Search for deadlines or meetings..."
            sx={{
              width: { xs: '100%', md: 235 },
              '& .MuiOutlinedInput-root': {
                borderRadius: 999,
                background: '#fff',
                  height: 34,
                  fontSize: 12,
                boxShadow: '0 1px 3px rgba(15, 23, 42, 0.06)',
              },
            }}
          />
        </Box>
      </Box>

      {/* View Tabs */}
      <Box sx={{ display: 'flex', gap: 0.6, mb: 1.25, flexWrap: 'wrap' }}>
        {['Day', 'Week', 'Month'].map((v, index) => (
          <Button
            key={v}
            variant={index === 1 ? 'contained' : 'outlined'}
            size="small"
            sx={{
              borderRadius: 999,
              textTransform: 'none',
              px: 1.15,
              py: 0.3,
              fontWeight: 700,
              fontSize: 11.5,
              minWidth: 84,
              backgroundColor: index === 1 ? '#4338ca' : 'transparent',
              color: index === 1 ? '#ffffff' : '#4338ca',
              borderColor: index === 1 ? '#4338ca' : 'rgba(67,56,202,0.35)',
              boxShadow: index === 1 ? '0 10px 18px rgba(67,56,202,0.22)' : 'none',
              '&:hover': {
                backgroundColor: index === 1 ? '#3730a3' : 'rgba(67,56,202,0.06)',
              },
            }}
          >
            {v}
          </Button>
        ))}
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
          border: '1px solid rgba(226, 232, 240, 1)',
          borderRadius: 2.5,
          overflow: 'hidden',
          background: '#fff',
        }}
      >
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <Box
            key={day}
            sx={{
              py: 0.9,
              textAlign: 'center',
              borderRight: '1px solid rgba(226, 232, 240, 1)',
              background: 'linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%)',
              '&:last-of-type': { borderRight: 'none' },
            }}
          >
            <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: '#94a3b8' }}>{day}</Typography>
          </Box>
        ))}

        {days.map((day, index) => {
          const dateStr = day ? `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${day}` : null;
          const hasEmotion = dateStr && emotionData[dateStr];

          return (
            <Box
              key={index}
              sx={{
                minHeight: { xs: 78, md: 100 },
                borderRight: '1px solid rgba(226, 232, 240, 1)',
                borderTop: '1px solid rgba(226, 232, 240, 1)',
                background: day ? '#fff' : '#fbfdff',
                '&:nth-of-type(7n)': { borderRight: 'none' },
              }}
            >
              <Box
                onClick={() => day && handleDateClick(day)}
                sx={{
                  height: { xs: 78, md: 100 },
                  borderRadius: 0,
                  background: day
                    ? hasEmotion
                      ? 'linear-gradient(180deg, #f8f8ff 0%, #fff 100%)'
                      : '#fff'
                    : 'transparent',
                  display: 'flex',
                  flexDirection: 'column',
                  p: 0.85,
                  cursor: day ? 'pointer' : 'default',
                  transition: 'background-color 0.16s ease, box-shadow 0.16s ease',
                  '&:hover': day
                    ? {
                        backgroundColor: '#f8fbff',
                        boxShadow: 'inset 0 0 0 1px rgba(79,70,229,0.12)',
                      }
                    : {},
                }}
              >
                {day ? (
                  <>
                    <Typography sx={{ fontSize: 10.5, fontWeight: 800, color: hasEmotion ? '#4338ca' : '#64748b' }}>{day}</Typography>

                    <Box sx={{ mt: 0.75, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', flex: 1 }}>
                      {hasEmotion ? (
                        <Box
                          sx={{
                            px: 1,
                            py: 0.45,
                            borderRadius: 1.5,
                            background: `${emotionData[dateStr]?.emotion ? '#ede9fe' : '#f1f5f9'}`,
                            color: '#4338ca',
                            fontSize: 11,
                            fontWeight: 700,
                            maxWidth: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {emotionData[dateStr]?.emotion} {emotionData[dateStr]?.note ? `• ${emotionData[dateStr].note}` : ''}
                        </Box>
                      ) : (
                        <Typography sx={{ fontSize: 11, color: '#cbd5e1' }}> </Typography>
                      )}
                    </Box>
                  </>
                ) : null}
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Legend */}
      <Box sx={{ mt: 1.5, pt: 1.25, borderTop: '1px solid rgba(148, 163, 184, 0.12)' }}>
        <Box sx={{ display: 'flex', gap: 0.65, flexWrap: 'wrap', mb: 0.9 }}>
          <Box sx={{ px: 1.1, py: 0.55, borderRadius: 999, background: 'linear-gradient(180deg, #eff6ff 0%, #ffffff 100%)', border: '1px solid rgba(59,130,246,0.10)' }}>
            <Typography sx={{ fontWeight: 900, fontSize: 11, color: '#1d4ed8' }}>{emotionCount} tracked days</Typography>
          </Box>
          <Box sx={{ px: 1.1, py: 0.55, borderRadius: 999, background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)', border: '1px solid rgba(148,163,184,0.14)' }}>
            <Typography sx={{ fontWeight: 800, fontSize: 11, color: '#475569' }}>{emptyCount} open days</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 0.6, flexWrap: 'wrap' }}>
          {emotions.map((e) => (
            <Box
              key={e.emoji}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.4,
                px: 0.8,
                py: 0.42,
                borderRadius: 999,
                background: `${e.color}22`,
                border: `1px solid ${e.color}55`,
              }}
            >
              <Typography sx={{ fontSize: 12 }}>{e.emoji}</Typography>
              <Typography sx={{ fontSize: 10.5, fontWeight: 700, color: '#475569' }}>{e.label}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add/Edit Mood - {selectedDate}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2" sx={{ mb: 2 }}>
            How are you feeling?
          </Typography>
          <Box sx={{ display: "flex", gap: 1, mb: 2, justifyContent: "center", flexWrap: "wrap" }}>
            {emotions.map((e) => (
              <Button
                key={e.emoji}
                onClick={() => setSelectedEmotion(e.emoji)}
                sx={{
                  fontSize: "2rem",
                  border: selectedEmotion === e.emoji ? `3px solid ${e.color}` : "2px solid #ddd",
                  p: 1,
                  minWidth: 60,
                  borderRadius: 2,
                  transition: "all 0.2s ease",
                  backgroundColor: selectedEmotion === e.emoji ? `${e.color}20` : "white",
                  "&:hover": { transform: "scale(1.2)" },
                }}
              >
                {e.emoji}
              </Button>
            ))}
          </Box>
          <TextField
            fullWidth
            multiline
            rows={3}
            label={t('components.Home.EmotionCalendar.reflection_note', 'Reflection Note')}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What's on your mind today..."
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>{t('components.Home.EmotionCalendar.cancel', 'Cancel')}</Button>
          <Button
            onClick={handleSaveEmotion}
            variant="contained"
            sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}