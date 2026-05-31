import { useEffect, useMemo, useState } from "react";
import { Box, Button, FormControl, MenuItem, Paper, Select, Stack, Typography } from "@mui/material";
import { useLocale } from '../../hooks/useLocale';

const DURATION_OPTIONS = [5, 10, 15, 25, 30, 45, 60, 90, 120];

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

export default function FocusTimer({ onFinish }: { onFinish: (minutes: number) => void }) {
  const { t, locale } = useLocale();
  const [selectedMinutes, setSelectedMinutes] = useState(5);
  const [remainingSeconds, setRemainingSeconds] = useState(5 * 60);
  const [running, setRunning] = useState(false);

  const selectedLabel = useMemo(() => {
    if (selectedMinutes >= 60) {
      const hours = selectedMinutes / 60;
      return locale === "km"
        ? `${hours} ម៉ោង`
        : `${hours} hour${hours > 1 ? "s" : ""}`;
    }

    return locale === "km"
      ? `${selectedMinutes} នាទី`
      : `${selectedMinutes} minute${selectedMinutes > 1 ? "s" : ""}`;
  }, [locale, selectedMinutes]);

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setRemainingSeconds((currentSeconds) => {
        if (currentSeconds <= 1) {
          clearInterval(interval);
          setRunning(false);
          onFinish(selectedMinutes);
          return 0;
        }

        return currentSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [running, onFinish, selectedMinutes]);

  const handleDurationChange = (value: number) => {
    setSelectedMinutes(value);
    setRemainingSeconds(value * 60);
    setRunning(false);
  };

  const handleStart = () => {
    if (remainingSeconds <= 0) {
      setRemainingSeconds(selectedMinutes * 60);
    }
    setRunning(true);
  };

  const handleReset = () => {
    setRunning(false);
    setRemainingSeconds(selectedMinutes * 60);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 4,
        border: "1px solid #e2e8f0",
        background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
        p: { xs: 2.5, md: 3.5 },
      }}
    >
      <Stack spacing={2} alignItems="center" textAlign="center">
        <Box>
          <Typography sx={{ fontSize: 12, letterSpacing: 1.2, color: "#64748b", mb: 0.5, textTransform: "uppercase" }}>
            {locale === "km" ? "វគ្គផ្តោត" : "Focus Session"}
          </Typography>
          <Typography sx={{ fontSize: { xs: 42, md: 60 }, fontWeight: 300, color: "#0f172a", lineHeight: 1 }}>
            {formatTime(remainingSeconds)}
          </Typography>
        </Box>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems="center" justifyContent="center" sx={{ width: "100%" }}>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <Select
              value={selectedMinutes}
              onChange={(event) => handleDurationChange(Number(event.target.value))}
              disabled={running}
              sx={{ borderRadius: 2, backgroundColor: "#fff" }}
            >
              {DURATION_OPTIONS.map((duration) => (
                <MenuItem key={duration} value={duration}>
                  {duration >= 60
                    ? locale === "km"
                      ? `${duration / 60} ម៉ោង`
                      : `${duration / 60} hour${duration > 60 ? "s" : ""}`
                    : locale === "km"
                      ? `${duration} នាទី`
                      : `${duration} minute${duration > 1 ? "s" : ""}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            onClick={handleStart}
            variant="contained"
            disabled={running}
            sx={{
              minWidth: 140,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 800,
              backgroundColor: "#2563eb",
              "&:hover": { backgroundColor: "#1d4ed8" },
            }}
          >
            {running
              ? (locale === "km" ? "កំពុងដំណើរការ" : "Running")
              : (t('components.Calendor.FocusTimer.start_focus', 'Start Focus'))}
          </Button>

          <Button
            onClick={handleReset}
            variant="outlined"
            sx={{
              minWidth: 120,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            {locale === "km" ? "កំណត់ឡើងវិញ" : "Reset"}
          </Button>
        </Stack>

        <Typography sx={{ color: "#64748b", fontSize: 13 }}>
          {locale === "km"
            ? `ជ្រើសរើសរយៈពេលផ្តោតពី 5 នាទី ដល់ 2 ម៉ោង។ ការបញ្ចប់នឹងត្រូវបានរក្សាទុកក្នុងពេលវេលាដែលបានជ្រើស។`
            : `Choose a focus duration from 5 minutes up to 2 hours. Completion is saved using the selected time.`}
        </Typography>

        <Typography sx={{ fontSize: 12, color: "#94a3b8" }}>
          {locale === "km"
            ? `បានជ្រើស៖ ${selectedLabel}`
            : `Selected: ${selectedLabel}`}
        </Typography>
      </Stack>
    </Paper>
  );
}
