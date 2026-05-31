import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Paper,
  Stack,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useLocale } from "../../hooks/useLocale";
import { useFocusData } from "../../hook/useFocusData";

const DURATION_OPTIONS = [5, 10, 20, 30, 45, 60, 90, 120];
const STORAGE_KEY = "home-focus-timer";

type FocusTimerState = {
  selectedMinutes: number;
  remainingSeconds: number;
  running: boolean;
  lastUpdated: number;
};

const clampMinutes = (minutes: number) => {
  if (!Number.isFinite(minutes)) return 20;
  return Math.min(120, Math.max(5, minutes));
};

const loadTimerState = (): FocusTimerState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        selectedMinutes: 20,
        remainingSeconds: 20 * 60,
        running: false,
        lastUpdated: Date.now(),
      };
    }

    const parsed = JSON.parse(raw) as Partial<FocusTimerState>;
    const selectedMinutes = clampMinutes(parsed.selectedMinutes ?? 20);
    const maxSeconds = selectedMinutes * 60;
    const remainingSeconds = Math.max(0, Math.min(parsed.remainingSeconds ?? maxSeconds, maxSeconds));

    return {
      selectedMinutes,
      remainingSeconds,
      running: Boolean(parsed.running),
      lastUpdated: typeof parsed.lastUpdated === "number" ? parsed.lastUpdated : Date.now(),
    };
  } catch {
    return {
      selectedMinutes: 20,
      remainingSeconds: 20 * 60,
      running: false,
      lastUpdated: Date.now(),
    };
  }
};

const formatClock = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

export default function FocusTimeSection() {
  const { t, locale } = useLocale();
  const { totalMinutes, addFocusSession } = useFocusData();
  const initialTimerState = loadTimerState();
  const initialTimerStateRef = useRef(initialTimerState);
  const addFocusSessionRef = useRef(addFocusSession);
  const [selectedMinutes, setSelectedMinutes] = useState(initialTimerState.selectedMinutes);
  const [remainingSeconds, setRemainingSeconds] = useState(initialTimerState.remainingSeconds);
  const [running, setRunning] = useState(initialTimerState.running);

  const progress = useMemo(() => {
    const totalSeconds = selectedMinutes * 60;
    if (totalSeconds <= 0) return 0;
    return Math.max(0, Math.min(100, ((totalSeconds - remainingSeconds) / totalSeconds) * 100));
  }, [remainingSeconds, selectedMinutes]);

  const selectedLabel = useMemo(() => {
    if (selectedMinutes >= 60) {
      const hours = selectedMinutes / 60;
      return locale === "km" ? `${hours} ម៉ោង` : `${hours} hour${hours > 1 ? "s" : ""}`;
    }

    return locale === "km"
      ? `${selectedMinutes} នាទី`
      : `${selectedMinutes} minute${selectedMinutes > 1 ? "s" : ""}`;
  }, [locale, selectedMinutes]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        selectedMinutes,
        remainingSeconds,
        running,
        lastUpdated: Date.now(),
      })
    );
  }, [selectedMinutes, remainingSeconds, running]);

  useEffect(() => {
    if (!initialTimerStateRef.current.running) return;

    const elapsedSeconds = Math.floor((Date.now() - initialTimerStateRef.current.lastUpdated) / 1000);
    if (elapsedSeconds <= 0) return;

    const syncedRemaining = initialTimerStateRef.current.remainingSeconds - elapsedSeconds;
    if (syncedRemaining <= 0) {
      addFocusSessionRef.current(initialTimerStateRef.current.selectedMinutes);
      setRemainingSeconds(initialTimerStateRef.current.selectedMinutes * 60);
      setRunning(false);
      return;
    }

    setRemainingSeconds(syncedRemaining);
  }, []);

  useEffect(() => {
    if (!running) return;

    const interval = window.setInterval(() => {
      setRemainingSeconds((currentSeconds) => {
        if (currentSeconds <= 1) {
          window.clearInterval(interval);
          setRunning(false);
          addFocusSession(selectedMinutes);
          return 0;
        }

        return currentSeconds - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [running, selectedMinutes, addFocusSession]);

  const handleSelect = (minutes: number) => {
    setSelectedMinutes(minutes);
    setRemainingSeconds(minutes * 60);
    setRunning(false);
  };

  const handleStart = () => {
    if (remainingSeconds <= 0) {
      setRemainingSeconds(selectedMinutes * 60);
    }

    setRunning(true);
  };

  const handleStop = () => {
    setRunning(false);
  };

  const handleReset = () => {
    setRunning(false);
    setRemainingSeconds(selectedMinutes * 60);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        height: "100%",
        minHeight: { xs: 320, md: 390 },
        borderRadius: 4,
        overflow: "hidden",
        background: "#020617",
        color: "#0f172a",
        boxShadow: "0 14px 28px rgba(59,130,246,0.14)",
        border: "1px solid rgba(59,130,246,0.14)",
      }}
    >
      <Box sx={{ p: { xs: 1.75, md: 2 }, display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Box>
          <Typography sx={{ fontSize: 11, letterSpacing: 1.4, textTransform: "uppercase", color: "#3b82f6", fontWeight: 800 }}>
            {locale === "km" ? "ពេលវេលាផ្តោត" : "Focus Time"}
          </Typography>
          <Typography sx={{ fontSize: 15, fontWeight: 800, mt: 0.5, color: "#0f172a" }}>
            {locale === "km" ? "កំណត់ម៉ោងផ្តោតដោយខ្លួនឯង" : "Set your own focus timer"}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
          {DURATION_OPTIONS.filter((minutes) => minutes <= 120).map((minutes) => {
            const active = selectedMinutes === minutes;
            return (
              <Button
                key={minutes}
                size="small"
                onClick={() => handleSelect(minutes)}
                disabled={running}
                sx={{
                  minWidth: 0,
                  px: 1.2,
                  py: 0.45,
                  borderRadius: 999,
                  textTransform: "none",
                  fontSize: 11.5,
                  fontWeight: 800,
                  color: active ? "#0f172a" : "#334155",
                  backgroundColor: active ? "#fffcf2" : "rgba(255,255,255,0.7)",
                  border: active ? "1px solid rgba(59,130,246,0.35)" : "1px solid rgba(148,163,184,0.22)",
                  boxShadow: active ? "0 4px 10px rgba(59,130,246,0.12)" : "none",
                  '&:hover': {
                    backgroundColor: active ? "#fffcf2" : "rgba(255,255,255,0.95)",
                  },
                }}
              >
                {minutes >= 60 ? `${minutes / 60}h` : `${minutes}m`}
              </Button>
            );
          })}
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.1fr 0.9fr" },
            gap: 1.25,
            alignItems: "stretch",
          }}
        >
          <Box
            sx={{
              background: "#fffcf2",
              borderRadius: 4,
              p: 2,
              minHeight: 250,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              border: "1px solid rgba(59,130,246,0.14)",
            }}
          >
            <Box>
              <Typography sx={{ fontSize: 13, color: "#64748b", mb: 0.5 }}>
                {locale === "km" ? "Timer" : "Timer"}
              </Typography>
              <Typography sx={{ fontSize: { xs: 42, md: 50 }, fontWeight: 300, lineHeight: 1, color: "#0f172a" }}>
                {formatClock(remainingSeconds)}
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.25} sx={{ mt: 2 }}>
              <Button
                onClick={running ? handleStop : handleStart}
                variant="contained"
                sx={{
                  minWidth: 118,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 800,
                  backgroundColor: running ? "#334155" : "#2563eb",
                  color: "#fff",
                  '&:hover': {
                    backgroundColor: running ? "#475569" : "#1d4ed8",
                  },
                }}
              >
                {running ? (locale === "km" ? "Stop" : "Stop") : (t('components.Calendor.FocusTimer.start_focus', 'Start Focus'))}
              </Button>

              <Button
                onClick={handleReset}
                variant="outlined"
                sx={{
                  minWidth: 102,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 700,
                  borderColor: "rgba(59,130,246,0.32)",
                  color: "#1d4ed8",
                  '&:hover': {
                    borderColor: "rgba(37,99,235,0.42)",
                    backgroundColor: "rgba(37,99,235,0.05)",
                  },
                }}
              >
                {locale === "km" ? "Reset" : "Reset"}
              </Button>
            </Stack>
          </Box>

          <Box
            sx={{
              background: "linear-gradient(180deg, #0f4c81 0%, #12355b 100%)",
              borderRadius: 4,
              p: 2.25,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 250,
              position: "relative",
              overflow: "hidden",
              border: "1px solid rgba(56,189,248,0.18)",
            }}
          >
            <CircularProgress
              variant="determinate"
              value={progress}
              size={180}
              thickness={4.8}
              sx={{ color: "#22d3ee" }}
            />
            <Box
              sx={{
                position: "absolute",
                width: 122,
                height: 122,
                borderRadius: "50%",
                backgroundColor: "#06111f",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
              }}
            >
              <Typography sx={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1 }}>
                {locale === "km" ? "Selected" : "Selected"}
              </Typography>
              <Typography sx={{ fontSize: 18, fontWeight: 800, color: "#fff", mt: 0.4 }}>
                {selectedLabel}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, flexWrap: "wrap", pt: 0.25 }}>
          <Typography sx={{ fontSize: 12, color: "#94a3b8" }}>
            {locale === "km" ? `ជ្រើសរើសពី 5 នាទី ដល់ 2 ម៉ោង។` : `Choose from 5 minutes up to 2 hours.`}
          </Typography>
          <Typography sx={{ fontSize: 12, color: "#94a3b8" }}>
            {locale === "km" ? `បានរក្សាទុកក្នុងសរុប: ${totalMinutes} នាទី` : `Saved total: ${totalMinutes} minutes`}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}