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

// ✅ TYPES
type LessonStatus = "completed" | "current" | "locked" | "default";

type Props = {
  lesson: Lesson;
  onClick?: (id: string) => void;
  status?: LessonStatus;
};

// ✅ SAFE LOCALE TYPE
type LocaleKey = "en" | "km";

const truncate = (s: string, n = 180) =>
  s.length > n ? s.slice(0, n).trim() + "…" : s;

export default function LessonCard({
  lesson,
  onClick,
  status = "default",
}: Props) {
  const navigate = useNavigate();
  const { locale } = useLocale();

  const safeLocale = (["en", "km"].includes(locale)
    ? locale
    : "en") as LocaleKey;

  const id = String(lesson?.id ?? "");

  // ✅ TITLE
  const rawTitle =
    lesson.title ??
    lesson.fallbackTitle ??
    lesson.titleKm ??
    `Lesson ${id}`;

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
      } else if (
        content.summary &&
        typeof content.summary === "object"
      ) {
        const summary = content.summary as Record<
          string,
          string
        >;

        description = truncate(
          summary[safeLocale] ??
            summary.en ??
            summary.km ??
            ""
        );
      } else if (typeof content.summary === "string") {
        description = truncate(content.summary);
      } else if (Array.isArray(content.paragraphs)) {
        description = truncate(content.paragraphs.join(" "));
      } else if (typeof content.description === "string") {
        description = truncate(content.description);
      } else {
        description = truncate(JSON.stringify(content));
      }
    }
  } catch {
    // ignore safely
  }

  // ✅ HANDLE CLICK
  const handleOpen = () => {
    if (status === "locked") return;

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
          status === "locked" ? "not-allowed" : "pointer",
        borderRadius: 3,
        boxShadow: "0 8px 24px rgba(17,24,39,0.06)",
        transition: "0.2s",
        "&:hover": {
          transform:
            status === "locked"
              ? "none"
              : "translateY(-6px)",
          boxShadow:
            status === "locked"
              ? undefined
              : "0 18px 40px rgba(17,24,39,0.12)",
        },
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "space-between",
        }}
      >
        {/* LEFT */}
        <Box sx={{ flex: 1 }}>
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <MenuBook sx={{ color: "#3B82F6" }} />
            <Typography
              sx={{
                fontSize: 16,
                fontWeight: 800,
                color: "#1F2937",
              }}
            >
              {title}
            </Typography>
          </Box>

          <Typography
            sx={{
              fontSize: 13,
              color: "#6B7280",
              mt: 1,
            }}
          >
            {description}
          </Typography>
        </Box>

        {/* RIGHT STATUS */}
        <Box sx={{ minWidth: 88, textAlign: "right" }}>
          {status === "completed" && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                justifyContent: "flex-end",
                mb: 1,
              }}
            >
              <CheckCircle sx={{ color: "#10B981" }} />
              <Typography
                sx={{ fontSize: 13, fontWeight: 700 }}
              >
                Completed
              </Typography>
            </Box>
          )}

          {status === "current" && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                justifyContent: "flex-end",
                mb: 1,
              }}
            >
              <PlayArrow sx={{ color: "#3B82F6" }} />
              <Typography
                sx={{ fontSize: 13, fontWeight: 700 }}
              >
                Continue
              </Typography>
            </Box>
          )}

          {status === "locked" && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                justifyContent: "flex-end",
                mb: 1,
              }}
            >
              <Lock sx={{ color: "#9CA3AF" }} />
              <Typography
                sx={{ fontSize: 13, fontWeight: 700 }}
              >
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
            status === "completed" ? "outlined" : "contained"
          }
          disabled={status === "locked"}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            px: 2,
          }}
        >
          {status === "completed"
            ? "Review"
            : status === "current"
            ? "Continue"
            : status === "locked"
            ? "Locked 🔒"
            : "Start"}
        </Button>
      </CardActions>
    </Card>
  );
}