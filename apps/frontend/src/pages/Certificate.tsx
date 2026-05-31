import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
  Chip,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  getCertificateEligibility,
  getQuizLessons,
  issueCertificate,
} from "../utils/api";

import type {
  CertificateEligibility,
  CertificateRecord,
  QuizLessonSummary,
} from "../utils/api";

export default function Certificate() {
  const navigate = useNavigate();

  const [eligibility, setEligibility] =
    useState<CertificateEligibility & {
      missingQuizLessons?: { lessonId: string; title: string }[];
    } | null>(null);

  const [lessons, setLessons] = useState<QuizLessonSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const [certificate, setCertificate] = useState<CertificateRecord | null>(null);
  const [issuing, setIssuing] = useState(false);

  const normalizeLessonTitle = (value: string) => {
    return value
      .split(' - ')
      .pop()
      ?.trim()
      .toLowerCase() ?? value.trim().toLowerCase();
  };

  /* ✅ ISSUE CERTIFICATE */
  const handleIssueCertificate = async () => {
    setIssuing(true);
    try {
      const res = await issueCertificate();
      console.log("✅ certificate:", res);
      setCertificate(res);
    } catch (err) {
      console.error("❌ issue error:", err);
      alert("មិនអាចចេញវិញ្ញាបនបត្របានទេ");
    } finally {
      setIssuing(false);
    }
  };

  /* ✅ LOAD DATA */
  useEffect(() => {
    const load = async () => {
      try {
        const [eligibilityData, lessonData] = await Promise.all([
          getCertificateEligibility(),
          getQuizLessons(),
        ]);

        setEligibility(eligibilityData);
        setLessons(lessonData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <Container sx={{ py: 10, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!eligibility) return null;

  const isLessonCompleted =
    eligibility.completedLessons === eligibility.totalLessons;

  const missingQuizLessonTitles = new Set(
    (eligibility.missingQuizLessons ?? []).map((lesson) => normalizeLessonTitle(lesson.title)),
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f3f7ff 0%, #ffffff 100%)",
        py: 6,
      }}
    >
      <Container maxWidth="md">

        {/* HEADER */}
        <Paper
          sx={{
            p: 4,
            mb: 3,
            borderRadius: 4,
            color: "white",
            background:
              "linear-gradient(135deg, #0f172a 0%, #1d4ed8 50%, #2563eb 100%)",
          }}
        >
          <Typography variant="h4" fontWeight={900}>
            🎓 មជ្ឈមណ្ឌលវិញ្ញាបនបត្រ
          </Typography>

          <Typography mt={1}>
            បញ្ចប់មេរៀន និងកម្រងសំណួរទាំងអស់ ≥80%
          </Typography>

          <Typography mt={2}>
            {eligibility.completedLessons}/{eligibility.totalLessons} មេរៀន
          </Typography>
        </Paper>

        {/* REQUIREMENTS */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Stack spacing={1}>
            <Chip
              label={`មេរៀន: ${eligibility.completedLessons}/${eligibility.totalLessons}`}
              color={isLessonCompleted ? "success" : "default"}
            />

            <Chip
              label={`កម្រងសំណួរ: ${eligibility.completedQuizzes}/${eligibility.totalLessons}`}
              color={
                eligibility.completedQuizzes === eligibility.totalLessons
                  ? "success"
                  : "default"
              }
            />

            <Chip
              label={`ពិន្ទុ: ${eligibility.averageScore}%`}
              color={
                eligibility.averageScore >= 80 ? "success" : "warning"
              }
            />
          </Stack>
        </Paper>

        {/* LESSON LIST */}
        {lessons.map((lesson) => {
          const completed = !missingQuizLessonTitles.has(normalizeLessonTitle(lesson.title));

          return (
            <Paper
              key={lesson.lessonId}
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 3,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                opacity: completed ? 1 : 0.7,
              }}
            >
              <Box>
                <Chip
                  label={completed ? "✅ បានបញ្ចប់" : "🔒 បានបិទ"}
                  color={completed ? "success" : "default"}
                  size="small"
                />

                <Typography fontWeight={800} mt={1}>
                  {lesson.title}
                </Typography>

                <Typography color="text.secondary">
                  {completed
                    ? "✔ កម្រងសំណួរបានបញ្ចប់"
                    : "❌ កម្រងសំណួរមិនទាន់បញ្ចប់"}
                </Typography>
              </Box>

              <Button
                variant="contained"
                onClick={() =>
                  navigate(`/quiz/paper/${lesson.lessonId}`)
                }
              >
                ទៅកាន់កម្រងសំណួរ ✅
              </Button>
            </Paper>
          );
        })}

        {/* ✅ ISSUE CERTIFICATE */}
        <Paper sx={{ p: 3, mt: 3 }}>
          {eligibility.eligible ? (
            <>
              <Typography fontWeight={900} color="green">
                🎉 ត្រៀមរួចរាល់ដើម្បីទទួលវិញ្ញាបនបត្រ!
              </Typography>

              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={handleIssueCertificate}
                disabled={issuing}
              >
                {issuing ? "កំពុងចេញ..." : "ចេញវិញ្ញាបនបត្រ ✅"}
              </Button>
            </>
          ) : (
            <Typography color="error">
              🔒 បំពេញលក្ខខណ្ឌទាំងអស់
            </Typography>
          )}
        </Paper>

        {/* ✅ CERTIFICATE RESULT */}
        {certificate && (
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography fontWeight={900}>
              ✅ បានចេញវិញ្ញាបនបត្រ!
            </Typography>

            <Typography mt={1}>
              កូដ: {certificate.certificateCode}
            </Typography>

            <Button
              variant="outlined"
              sx={{ mt: 2 }}
              onClick={() => navigate("/certificate/view")}
            >
              មើល / ទាញយកវិញ្ញាបនបត្រ 📄
            </Button>
          </Paper>
        )}

      </Container>
    </Box>
  );
}