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
  IconButton,
  Grid,
  Chip,
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
  const [animatedDates, setAnimatedDates] = useState<Set<string>>(new Set());

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
      setAnimatedDates(prev => new Set([...prev, selectedDate]));
      setTimeout(() => {
        setAnimatedDates(prev => {
          const next = new Set(prev);
          next.delete(selectedDate);
          return next;
        });
      }, 600);
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

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <Paper
      sx={{
        p: 3,
        mt: 4,
        borderRadius: 3,
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        animation: "slideInUp 0.6s ease-out",
        "@keyframes slideInUp": {
          from: { opacity: 0, transform: "translateY(20px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6" fontWeight={700}>
          🎭 Mood & Reflection Calendar
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton size="small" onClick={handlePrevMonth} sx={{ "&:hover": { backgroundColor: "rgba(0,0,0,0.1)" } }}>
            <Typography component="span" fontSize="1.1rem" lineHeight={1}>
              ←
            </Typography>
          </IconButton>
          <Typography variant="body2" fontWeight={600} sx={{ minWidth: 160, textAlign: "center" }}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </Typography>
          <IconButton size="small" onClick={handleNextMonth} sx={{ "&:hover": { backgroundColor: "rgba(0,0,0,0.1)" } }}>
            <Typography component="span" fontSize="1.1rem" lineHeight={1}>
              →
            </Typography>
          </IconButton>
        </Box>
      </Box>

      <Grid container spacing={0.5} sx={{ mb: 1 }}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <Grid item xs={12 / 7} key={day}>
            <Typography variant="caption" fontWeight={700} sx={{ textAlign: "center", display: "block", color: "#666" }}>
              {day}
            </Typography>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={0.5}>
        {days.map((day, index) => {
          const dateStr = day ? `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${day}` : null;
          const hasEmotion = dateStr && emotionData[dateStr];
          const isAnimating = dateStr && animatedDates.has(dateStr);

          return (
            <Grid item xs={12 / 7} key={index}>
              <Paper
                onClick={() => day && handleDateClick(day)}
                sx={{
                  p: 1,
                  textAlign: "center",
                  minHeight: 70,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  background: day ? "white" : "transparent",
                  cursor: day ? "pointer" : "default",
                  border: hasEmotion ? "2px solid #667eea" : "1px solid #e0e0e0",
                  borderRadius: 1.5,
                  transition: "all 0.3s ease",
                  animation: isAnimating ? "pulse 0.6s ease-out" : "none",
                  "@keyframes pulse": {
                    "0%": { transform: "scale(1)" },
                    "50%": { transform: "scale(1.15)" },
                    "100%": { transform: "scale(1)" },
                  },
                  "&:hover": day ? { boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)", transform: "translateY(-2px)" } : {},
                }}
              >
                {day && (
                  <>
                    <Typography variant="caption" fontWeight={600} sx={{ mb: 0.5 }}>
                      {day}
                    </Typography>
                    {hasEmotion ? (
                      <Typography sx={{ fontSize: "1.8rem", animation: "bounce 0.6s ease-out", "@keyframes bounce": { "0%": { transform: "translateY(-10px)" }, "100%": { transform: "translateY(0)" } } }}>
                        {emotionData[dateStr]?.emotion}
                      </Typography>
                    ) : (
                      <Typography variant="caption" sx={{ color: "#ccc" }}>
                        Click
                      </Typography>
                    )}
                  </>
                )}
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      <Box sx={{ mt: 3, pt: 2, borderTop: "1px solid #ddd" }}>
        <Typography variant="caption" fontWeight={600} sx={{ display: "block", mb: 1 }}>
          Emotion Legend:
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {emotions.map((e) => (
            <Chip
              key={e.emoji}
              label={`${e.emoji} ${e.label}`}
              size="small"
              sx={{
                backgroundColor: `${e.color}30`,
                border: `2px solid ${e.color}`,
                fontWeight: 600,
              }}
            />
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