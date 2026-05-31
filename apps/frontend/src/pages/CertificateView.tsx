import {
  Box,
  Container,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import {
  getMyCertificate,
  verifyCertificate,
  type CertificateRecord,
} from "../utils/api";
import { getUser } from "../utils/auth";

export default function CertificateView() {
  const navigate = useNavigate();
  const certificateRef = useRef<HTMLDivElement | null>(null);
  const [certificate, setCertificate] = useState<CertificateRecord | null>(null);
  const user = getUser();
  const [downloadError, setDownloadError] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getMyCertificate();
        setCertificate(res);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);

  if (!certificate) {
    return (
      <Container sx={{ py: 10 }}>
        <Typography>Loading certificate...</Typography>
      </Container>
    );
  }

  const recipientName = user?.name?.trim() || 'Student';

  const handleDownload = async () => {
    if (!certificateRef.current) return;

    try {
      setDownloading(true);
      setDownloadError('');

      await verifyCertificate(certificate.certificateCode);

      const canvas = await html2canvas(certificateRef.current, {
        backgroundColor: '#dbeafe',
        scale: 3,
        useCORS: true,
        scrollY: -window.scrollY,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`certificate-${certificate.certificateCode}.pdf`);
    } catch (err) {
      setDownloadError(err instanceof Error ? err.message : 'Certificate verification failed');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: 6,
        background: 'linear-gradient(180deg, #d8ecfb 0%, #eef6fd 45%, #d9eaf8 100%)',
      }}
    >
      <Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box
          ref={certificateRef}
          className="certificate-card"
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: 980,
            aspectRatio: '1.45 / 1',
            overflow: 'hidden',
            borderRadius: 0,
            boxShadow: '0 24px 50px rgba(29, 78, 216, 0.18)',
            background: 'linear-gradient(135deg, #b7d5ef 0%, #f8fbff 26%, #ffffff 58%, #eff7ff 100%)',
            border: '1px solid rgba(37, 99, 235, 0.12)',
          }}
        >
          <Box sx={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 85% 10%, rgba(96, 165, 250, 0.35) 0, rgba(96, 165, 250, 0) 28%), radial-gradient(circle at 0% 100%, rgba(37, 99, 235, 0.32) 0, rgba(37, 99, 235, 0) 25%)' }} />
          <Box sx={{ position: 'absolute', top: 0, right: 0, width: 260, height: 180, background: 'linear-gradient(135deg, rgba(37,99,235,0.34), rgba(96,165,250,0.15) 55%, transparent 56%)', clipPath: 'polygon(0 0, 100% 0, 100% 100%, 44% 100%)' }} />
          <Box sx={{ position: 'absolute', top: 0, right: 98, width: 170, height: 120, background: 'rgba(255,255,255,0.45)', clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />
          <Box sx={{ position: 'absolute', bottom: 0, left: 0, width: 190, height: 150, background: 'linear-gradient(135deg, #0f4fb3 0%, #2f77d6 55%, #5aa1ee 100%)', clipPath: 'polygon(0 100%, 100% 100%, 0 0)' }} />
          <Box sx={{ position: 'absolute', bottom: 0, left: 110, width: 125, height: 95, background: 'rgba(255,255,255,0.18)', clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }} />

          <Box sx={{ position: 'relative', zIndex: 1, height: '100%', p: { xs: 4, md: 7 }, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box sx={{ width: 96, height: 96, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56, borderRadius: 1 }}>
                  📐
                </Box>
                <Typography sx={{ fontSize: 32, letterSpacing: 3, color: 'text.secondary', fontWeight: 900 }}>
                  KANIT
                </Typography>
              </Box>
              <Box sx={{ width: 110, height: 110, borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, #ffffff 0, #eff6ff 45%, #dbeafe 100%)', border: '6px solid #93c5fd', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(37,99,235,0.18)' }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 900, color: '#1d4ed8', lineHeight: 1 }}>BEST</Typography>
                  <Typography sx={{ fontSize: 11, fontWeight: 800, color: '#1d4ed8', letterSpacing: 0.8, lineHeight: 1 }}>AWARD</Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ mt: { xs: 4, md: 7 }, maxWidth: 680 }}>
              <Typography
                sx={{
                  fontSize: { xs: 40, md: 72 },
                  lineHeight: 0.95,
                  fontWeight: 900,
                  color: '#1d4ed8',
                  letterSpacing: -1.5,
                }}
              >
                Certificate
              </Typography>
              <Typography sx={{ mt: 1, fontSize: { xs: 16, md: 24 }, fontWeight: 800, letterSpacing: 1.2, color: '#111827' }}>
                OF ACHIEVEMENT
              </Typography>
              <Typography sx={{ mt: 0.5, fontSize: 12, letterSpacing: 1.1, color: 'text.secondary' }}>
                THIS CERTIFICATE IS PRESENTED TO
              </Typography>

              <Typography
                sx={{
                  mt: 3,
                  fontSize: { xs: 28, md: 48 },
                  fontWeight: 900,
                  color: '#1e40af',
                  letterSpacing: -0.8,
                }}
              >
                {recipientName}
              </Typography>

              <Typography sx={{ mt: 2, maxWidth: 700, fontSize: { xs: 12, md: 14 }, lineHeight: 1.65, color: '#4b5563' }}>
                This certifies that the student has successfully completed {certificate.course} with dedication and commitment to learning. The achievement reflects consistent progress, correct quiz completion, and successful mastery of the course material.
              </Typography>

              <Box sx={{ mt: 4, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, alignItems: 'end', maxWidth: 760 }}>
                <Box>
                  <Typography sx={{ fontSize: 14, fontWeight: 800, color: '#111827' }}>
                    {new Date(certificate.issuedAt).toLocaleDateString(undefined, {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </Typography>
                  <Divider sx={{ my: 0.75, width: 120, borderColor: 'rgba(17,24,39,0.35)' }} />
                  <Typography sx={{ fontSize: 12, color: '#4b5563', letterSpacing: 0.8 }}>
                    DATE
                  </Typography>
                </Box>

                <Box sx={{ justifySelf: 'end', textAlign: 'center' }}>
                  <Box sx={{ width: 120, height: 58, position: 'relative', mx: 'auto' }}>
                    <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 18, height: 2, background: '#6b7280' }} />
                    <Box sx={{ position: 'absolute', left: 38, bottom: 20, fontSize: 28, color: '#111827', transform: 'rotate(-8deg)' }}>
                      ✍
                    </Box>
                  </Box>
                  <Typography sx={{ fontSize: 12, color: '#4b5563', letterSpacing: 0.8 }}>
                    SIGNATURE
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mt: 3, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <Box>
                  <Typography sx={{ fontSize: 12, color: '#4b5563', fontWeight: 700 }}>SCORE</Typography>
                  <Typography sx={{ fontSize: 22, fontWeight: 900, color: '#111827' }}>{certificate.averageScore}%</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 12, color: '#4b5563', fontWeight: 700 }}>CERTIFICATE CODE</Typography>
                  <Typography sx={{ fontSize: 16, fontWeight: 900, color: '#111827', letterSpacing: 0.5 }}>{certificate.certificateCode}</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box className="certificate-actions" sx={{ width: '100%', maxWidth: 980 }}>
          {downloadError && (
            <Typography sx={{ mt: 2, color: 'error.main', textAlign: 'center' }}>
              {downloadError}
            </Typography>
          )}

          <Button
            variant="contained"
            sx={{ mt: 3 }}
            fullWidth
            onClick={handleDownload}
            disabled={downloading}
          >
            {downloading ? 'Verifying...' : 'Download Certificate PDF'}
          </Button>

          <Button
            variant="text"
            sx={{ mt: 1 }}
            fullWidth
            onClick={() => navigate("/certificate")}
          >
            Back to Certificate Center
          </Button>
        </Box>

      </Container>
    </Box>
  );
}