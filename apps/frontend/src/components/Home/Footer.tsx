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
        mt: 8,
        py: 4,
        fontFamily: "'Noto Sans Khmer', sans-serif",
      }}
    >
      <Container maxWidth="lg">
        {/* Main Footer Content */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            gap: 4,
          }}
        >
          {/* Platform Info */}
          <Box>
            <Typography fontWeight={700} fontSize={16} mb={1}>
              {t("footer.title", "វេបសាយសិក្សាអនឡាញ")}
            </Typography>
            <Typography fontSize={14}>
              {t("footer.subtitle", "គណិតវិទ្យា ថ្នាក់ទី១២")}
            </Typography>
            <Typography fontSize={14} mt={1}>
              {t("footer.description", "សម្រាប់ការសិក្សា ការវាយតម្លៃ និងការអភិវឌ្ឍចំណេះដឹងរបស់សិស្ស")}
            </Typography>
          </Box>

          {/* Disclaimer */}
          <Box maxWidth={360}>
            <Typography fontWeight={600} fontSize={14} mb={1}>
              {t("footer.disclaimer_title", "សេចក្តីប្រកាស")}
            </Typography>
            <Typography fontSize={13} color="text.secondary">
              {t(
                "footer.disclaimer_text",
                "វិញ្ញាបនបត្រ និងមាតិកានៅលើវេបសាយនេះ ត្រូវបានបង្កើតឡើងសម្រាប់គោលបំណងសិក្សា និងវាយតម្លៃតែប៉ុណ្ណោះ មិនមែនជាឯកសារផ្លូវការរបស់ក្រសួងអប់រំ យុវជន និងកីឡា ទេ។"
              )}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Bottom Row */}
        <Typography
          fontSize={13}
          textAlign="center"
          color="text.secondary"
        >
          {t("footer.copyright", "© {year} វេបសាយសិក្សាអនឡាញ | រក្សាសិទ្ធិគ្រប់យ៉ាង").replace(
            "{year}",
            new Date().getFullYear().toString()
          )}
        </Typography>
      </Container>
    </Box>
  );
}
