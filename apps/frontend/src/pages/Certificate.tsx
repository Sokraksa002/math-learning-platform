import {
  Box,
  Button,
  Container,
  Typography,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useLocale } from "../hooks/useLocale";

export default function Certificate() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const navigate = useNavigate();
  const { t } = useLocale();

  const certificateRef = useRef<HTMLDivElement>(null);

  const studentName = "Student Name";
  const score = "8 / 10";
  const date = new Date().toLocaleDateString();

  const handleDownloadPDF = async () => {
    if (!certificateRef.current) return;

    const canvas = await html2canvas(certificateRef.current, {
      scale: 2,
      backgroundColor: "#F7F3EB",
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const imgWidth = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`certificate-chapter-${chapterId}.pdf`);
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#F3EFE8", py: 6 }}>
      <Container maxWidth="lg">
        {/* ✅ Certificate Canvas */}
        <Box
          ref={certificateRef}
          sx={{
            position: "relative",
            backgroundColor: "#F7F3EB",
            borderRadius: "20px",
            overflow: "hidden",
            p: 8,
            minHeight: "420px",
            boxShadow: "0 30px 80px rgba(0,0,0,0.08)",
          }}
        >
          {/* ✅ Decorative Shapes */}
          <Box
            sx={{
              position: "absolute",
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: "#F9AFA3",
              top: -80,
              right: -50,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              width: 140,
              height: 140,
              borderRadius: "20%",
              background: "#7CC4A7",
              bottom: -50,
              right: 150,
              transform: "rotate(45deg)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              width: 160,
              height: 160,
              borderRadius: "50%",
              border: "18px solid #0F2A44",
              bottom: -60,
              left: -60,
            }}
          />

          {/* ✅ Content */}
          <Box sx={{ position: "relative", zIndex: 2 }}>
            <Typography
              sx={{
                fontSize: 48,
                fontWeight: 800,
                color: "#0F2A44",
                mb: 2,
              }}
            >
              Certificate
            </Typography>

            <Typography sx={{ fontSize: 18, color: "#444", mb: 4 }}>
              This certifies that
            </Typography>

            <Typography
              sx={{
                fontSize: 32,
                fontWeight: 700,
                color: "#0F2A44",
                mb: 3,
              }}
            >
              {studentName}
            </Typography>

            <Typography sx={{ fontSize: 18, mb: 1 }}>
              has successfully completed
            </Typography>

            <Typography
              sx={{ fontSize: 22, fontWeight: 600, mb: 3 }}
            >
              Quiz — Chapter {chapterId}
            </Typography>

            <Typography sx={{ fontSize: 16 }}>
              Score: <strong>{score}</strong>
            </Typography>

            <Box
              sx={{
                mt: 6,
                display: "flex",
                justifyContent: "space-between",
                width: "60%",
              }}
            >
              <Box>
                <Typography fontSize={14}>{t('pages.Certificate.date', 'Date')}</Typography>
                <Typography fontWeight={600}>{date}</Typography>
              </Box>

              <Box>
                <Typography fontSize={14}>{t('pages.Certificate.authorized_by', 'Authorized by')}</Typography>
                <Typography fontWeight={600}>{t('pages.Certificate.admin', 'Admin')}</Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* ✅ Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            mt: 4,
          }}
        >
          <Button
            onClick={handleDownloadPDF}
            sx={{
              backgroundColor: "#F9AFA3",
              color: "#111",
              fontWeight: 700,
              px: 4,
              "&:hover": { backgroundColor: "#F79C8D" },
            }}
          >
            Download PDF
          </Button>

          <Button onClick={() => navigate("/quiz")}>{t('pages.Certificate.back', 'Back')}</Button>
        </Box>
      </Container>
    </Box>
  );
}