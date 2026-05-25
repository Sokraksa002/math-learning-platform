import { Box, Container, Typography, Divider } from "@mui/material";
import { useLocale } from "../../hooks/useLocale";

export default function Footer() {
  const { t } = useLocale();

  return (
    <Box
  component="footer"
  sx={{
    backgroundColor: "#F7F3EB",
    borderTop: "1px solid #e0e0e0",
    mt: 4,              // ✅ smaller top margin
    py: 2,              // ✅ smaller padding
    fontFamily: "'Noto Sans Khmer', sans-serif",
  }}
>
  <Container maxWidth="lg">
    
    {/* Main Content */}
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "space-between",
        gap: 2,                 // ✅ smaller gap
      }}
    >
      {/* LEFT */}
      <Box>
        <Typography fontWeight={700} fontSize={14} mb={0.5}>
          {t("footer.title", "វេបសាយសិក្សាអនឡាញ")}
        </Typography>

        <Typography fontSize={13}>
          {t("footer.subtitle", "គណិតវិទ្យា ថ្នាក់ទី១២")}
        </Typography>

        <Typography fontSize={13} mt={0.5}>
          {t(
            "footer.description",
            "សម្រាប់ការសិក្សា និងការអភិវឌ្ឍចំណេះដឹងរបស់សិស្ស"
          )}
        </Typography>
      </Box>

      {/* RIGHT */}
      <Box maxWidth={320}>
        <Typography fontWeight={600} fontSize={13} mb={0.5}>
          {t("footer.disclaimer_title", "សេចក្តីប្រកាស")}
        </Typography>

        <Typography fontSize={12} color="text.secondary">
          {t(
            "footer.disclaimer_text",
            "វិញ្ញាបនបត្រ និងមាតិកានៅលើវេបសាយនេះ គឺសម្រាប់សិក្សាតែប៉ុណ្ណោះ។"
          )}
        </Typography>
      </Box>
    </Box>

    <Divider sx={{ my: 2 }} />   {/* ✅ reduced spacing */}

    {/* Bottom */}
    <Typography
      fontSize={12}
      textAlign="center"
      color="text.secondary"
    >
      {t(
        "footer.copyright",
        "© {year} វេបសាយសិក្សាអនឡាញ | រក្សាសិទ្ធិគ្រប់យ៉ាង"
      ).replace("{year}", new Date().getFullYear().toString())}
    </Typography>
  </Container>
</Box>
  );
}
