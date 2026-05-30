import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { useLocale } from "../../hooks/useLocale";
import { isValidUuid } from "../../utils/validators";

import {
  MenuBook,
  CheckCircle,
  PlayArrow,
  Lock,
} from "@mui/icons-material";

import type { Lesson } from "../../utils/api";

type LessonStatus = "completed" | "current" | "locked" | "default";

type Props = {
  lesson: Lesson;
  completed?: boolean;
  onClick?: (id: string) => void;
  status?: LessonStatus;
};

type LocaleKey = "en" | "km";

const truncate = (s: string, n = 120) =>
  s.length > n ? s.slice(0, n).trim() + "…" : s;

export default function LessonCard({
  lesson,
  completed = false,
  onClick,
  status = "default",
}: Props) {
  const navigate = useNavigate();
  const { locale } = useLocale();

  const safeLocale = (["en", "km"].includes(locale)
    ? locale
    : "en") as LocaleKey;

  const id = String(lesson?.id ?? "");

  // ✅ STATUS
  const finalStatus: LessonStatus =
    status === "default"
      ? completed
        ? "completed"
        : "current"
      : status;

  // ✅ TITLE
  const rawTitle =
    lesson.title ?? lesson.fallbackTitle ?? `Lesson ${id}`;

  const title =
    typeof rawTitle === "object"
      ? rawTitle[safeLocale] ??
        rawTitle.en ??
        rawTitle.km ??
        "Untitled"
      : String(rawTitle);

  // ✅ DESCRIPTION
  let description = "No description available.";
  const content = lesson?.contentJson ?? null;

  try {
    if (content) {
      if (typeof content === "string") {
        description = truncate(content);
      } else if (
        typeof (content as Record<string, unknown>)[
          safeLocale
        ] === "string"
      ) {
        description = truncate(
          (content as Record<string, string>)[safeLocale]
        );
      } else if (typeof content.summary === "string") {
        description = truncate(content.summary);
      }
    }
  } catch {
    // ignore safely ✅ FIXED ESLINT
  }

  // ✅ CLICK HANDLER
  const handleOpen = () => {
    if (finalStatus === "locked") return;

    if (!isValidUuid(id)) {
      console.warn("Invalid lesson id:", id);
      return;
    }

    if (onClick) {
      onClick(id);
    } else {
      navigate(`/lesson/${id}`);
    }
  };

  return (
    <Card
      onClick={handleOpen}
      sx={{
        cursor:
          finalStatus === "locked" ? "not-allowed" : "pointer",
        borderRadius: 3,
        backgroundColor: "#ffffff",
        border: "1px solid #ffffff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
        transition: "0.25s",

        "&:hover": {
          transform:
            finalStatus === "locked"
              ? "none"
              : "translateY(-4px)",
          boxShadow:
            finalStatus === "locked"
              ? undefined
              : "0 10px 24px rgba(0,0,0,0.08)",
        },
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        {/* LEFT */}
        <Box sx={{ flex: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <MenuBook sx={{ color: "#3B82F6" }} />

            <Typography
              sx={{
                fontSize: 16,
                fontWeight: 700,
                color: "#1E293B",
              }}
            >
              {title}
            </Typography>
          </Box>

          <Typography
            sx={{
              fontSize: 13,
              color: "#64748B",
              mt: 1,
            }}
          >
            {description}
          </Typography>
        </Box>

        {/* RIGHT STATUS */}
        <Box sx={{ minWidth: 100, textAlign: "right" }}>
          {finalStatus === "completed" && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 1,
              }}
            >
              <CheckCircle sx={{ color: "#10B981" }} />
              <Typography fontWeight={700} fontSize={13}>
                Completed
              </Typography>
            </Box>
          )}

          {finalStatus === "current" && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 1,
              }}
            >
              <PlayArrow sx={{ color: "#3B82F6" }} />
              <Typography fontWeight={700} fontSize={13}>
                Continue
              </Typography>
            </Box>
          )}

          {finalStatus === "locked" && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 1,
              }}
            >
              <Lock sx={{ color: "#ffffff" }} />
              <Typography fontWeight={700} fontSize={13}>
                Locked
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>

      {/* BUTTON */}
      <CardActions sx={{ justifyContent: "flex-end", pr: 2 }}>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleOpen();
          }}
          variant={
            finalStatus === "completed"
              ? "outlined"
              : "contained"
          }
          disabled={finalStatus === "locked"}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            px: 2,
            fontWeight: 600,

            ...(finalStatus !== "completed" && {
              backgroundColor: "#2563EB",
              "&:hover": {
                backgroundColor: "#1E40AF",
              },
            }),
          }}
        >
          {finalStatus === "completed"
            ? "Review"
            : finalStatus === "current"
            ? "Continue"
            : finalStatus === "locked"
            ? "Locked"
            : "Start"}
        </Button>
      </CardActions>
    </Card>
  );
}
