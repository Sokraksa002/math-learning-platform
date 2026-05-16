import { Box, Button, Container, Divider, Paper, Stack, Typography } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function Certificate() {
  const { chapterId } = useParams<{ chapterId?: string }>();
  const navigate = useNavigate();
  const certificateRef = useRef<HTMLDivElement | null>(null);

  /* =========================
     ✅ MOCK DATA (NO BACKEND)
  ========================= */
  const certificateData = [
    { chapterId: "1", score: 90 },
    { chapterId: "2", score: 60 },
    { chapterId: "3", score: 85 },
    { chapterId: "4", score: 70 },
  ];

  /* =========================
     ✅ IF NO chapterId → SHOW LIST
  ========================= */
  if (!chapterId) {
    return (
      <Box sx={{ minHeight: "100vh", background: "linear-gradient(180deg, #f3f7ff 0%, #ffffff 100%)", py: { xs: 4, md: 8 } }}>
        <Container maxWidth="md">
          <Paper
            sx={{
              p: { xs: 3, md: 4 },
              mb: 3,
              borderRadius: 4,
              color: "white",
              background: "linear-gradient(135deg, #0f172a 0%, #1d4ed8 45%, #7c3aed 100%)",
            }}
          >
            <Typography variant="overline" sx={{ letterSpacing: 1.2, opacity: 0.85 }}>
              Achievement center
            </Typography>
            <Typography variant="h4" fontWeight={900} sx={{ mt: 1 }}>
              Your Certificates
            </Typography>
            <Typography sx={{ mt: 1, opacity: 0.9, maxWidth: 720 }}>
              Open any unlocked certificate to see the final award you can download.
            </Typography>
          </Paper>

          {certificateData.map((item) => {
            const unlocked = item.score >= 80;

            return (
              <Paper
                key={item.chapterId}
                sx={{
                  p: { xs: 2.5, md: 3 },
                  mb: 3,
                  borderRadius: 4,
                  display: "flex",
                  gap: 2,
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "space-between",
                  alignItems: { xs: "flex-start", sm: "center" },
                  boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
                  opacity: unlocked ? 1 : 0.6,
                  border: "1px solid #e2e8f0",
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography fontWeight={900} color="#0f172a">
                    Chapter {item.chapterId}
                  </Typography>
                  <Typography sx={{ mt: 0.5, color: "text.secondary" }}>
                    Score: {item.score}% {unlocked ? "- certificate unlocked" : "- locked until 80%"}
                  </Typography>
                </Box>

                {unlocked ? (
                  <Button
                    onClick={() =>
                      navigate(`/certificate/${item.chapterId}`)
                    }
                    sx={{
                      background: "linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%)",
                      color: "#fff",
                      px: 3,
                      borderRadius: 999,
                      minWidth: 120,
                    }}
                  >
                    View
                  </Button>
                ) : (
                  <Box
                    sx={{
                      px: 3,
                      py: 1,
                      backgroundColor: "#eef2ff",
                      borderRadius: 999,
                      color: "#64748b",
                    }}
                  >
                    🔒 Locked
                  </Box>
                )}
              </Paper>
            );
          })}
        </Container>
      </Box>
    );
  }

  /* =========================
     ✅ CERTIFICATE VIEW
  ========================= */

  const studentName = "STUDENT NAME";

  const current = certificateData.find(
    (item) => item.chapterId === chapterId
  );

  const score = current?.score ?? 0;
  const percentage = score;

  const isUnlocked = percentage >= 80;

  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleDownloadPDF = async () => {
    if (!certificateRef.current) return;

    const canvas = await html2canvas(certificateRef.current);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({ orientation: "landscape" });
    pdf.addImage(imgData, "PNG", 10, 10, 280, 160);
    pdf.save(`Certificate_${chapterId}.pdf`);
  };

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(180deg, #f3f7ff 0%, #ffffff 100%)", py: { xs: 4, md: 8 } }}>
      <Container maxWidth="lg">

        {/* 🔒 LOCKED */}
        {!isUnlocked ? (
          <Paper sx={{ p: { xs: 4, md: 6 }, textAlign: "center", borderRadius: 4, border: "1px solid #e2e8f0" }}>
            <Typography sx={{ fontSize: 24, fontWeight: 900 }}>
              🔒 Certificate Locked
            </Typography>

            <Typography sx={{ mt: 2, color: "text.secondary" }}>
              You need at least 80% to unlock.
            </Typography>

            <Button
              sx={{ mt: 3, borderRadius: 999, px: 3 }}
              onClick={() => navigate("/certificate")}
              variant="contained"
            >
              Back
            </Button>
          </Paper>
        ) : (
          <>
            {/* 🎓 CERTIFICATE */}
            <Paper
              ref={certificateRef}
              sx={{
                p: { xs: 4, md: 7 },
                textAlign: "center",
                borderRadius: 5,
                border: "8px solid #1d4ed8",
                background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
                boxShadow: "0 24px 60px rgba(15, 23, 42, 0.12)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box sx={{ position: "absolute", inset: 20, border: "1px solid rgba(29, 78, 216, 0.12)", borderRadius: 4, pointerEvents: "none" }} />
              <Typography sx={{ fontSize: 36, fontWeight: 900, color: "#0f172a", position: "relative" }}>
                Certificate
              </Typography>

              <Typography sx={{ mt: 2, color: "#475569", position: "relative" }}>
                This is awarded to
              </Typography>

              <Typography sx={{ fontSize: { xs: 26, md: 32 }, fontWeight: 900, my: 2, color: "#1d4ed8", position: "relative" }}>
                {studentName}
              </Typography>

              <Typography sx={{ color: "#334155", position: "relative" }}>
                For completing Chapter {chapterId}
              </Typography>

              <Typography sx={{ mt: 2, color: "#0f172a", fontWeight: 700, position: "relative" }}>
                Score: {score}%
              </Typography>

              <Divider sx={{ my: 4, borderColor: "rgba(29, 78, 216, 0.15)", position: "relative" }} />

              <Stack direction={{ xs: "column", sm: "row" }} justifyContent="center" spacing={2} sx={{ position: "relative" }}>
                <Box sx={{ px: 3, py: 1.5, borderRadius: 3, bgcolor: "rgba(29, 78, 216, 0.08)", color: "#1d4ed8", fontWeight: 800 }}>
                  Verified completion
                </Box>
                <Box sx={{ px: 3, py: 1.5, borderRadius: 3, bgcolor: "rgba(15, 23, 42, 0.04)", color: "#0f172a", fontWeight: 700 }}>
                  {date}
                </Box>
              </Stack>
            </Paper>

            {/* 🎯 BUTTONS */}
            <Stack direction={{ xs: "column", sm: "row" }} justifyContent="center" spacing={2} sx={{ textAlign: "center", mt: 4 }}>
              <Button
                onClick={handleDownloadPDF}
                sx={{
                  background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
                  color: "#fff",
                  px: 3,
                  borderRadius: 999,
                }}
                variant="contained"
              >
                Download PDF
              </Button>

              <Button onClick={() => navigate("/certificate")} variant="outlined" sx={{ px: 3, borderRadius: 999 }}>
                Back
              </Button>
            </Stack>
          </>
        )}
      </Container>
    </Box>
  );
}