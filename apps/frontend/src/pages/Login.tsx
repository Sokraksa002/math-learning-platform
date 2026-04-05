import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import bookImg from "../assets/Login/Book.png";
import paperImg from "../assets/Login/Paper.png";
import backpackImg from "../assets/Login/backpack.png";
import bg1 from "../assets/Login/bg1.png";
import bg2 from "../assets/Login/bg2.png";

export default function Login() {
  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        height: "100dvh",
        width: "100vw",
        display: "flex",
        overflow: "hidden",
        background:
          "radial-gradient(circle at 12% 16%, #fefefe 0%, #f4f6fb 45%, #ebedf4 100%)",
      }}
    >
      {/* LEFT SIDE — FULL BACKGROUND IMAGE */}
      <Box
        sx={{
          flex: 1,
          height: "100dvh",
          position: "relative",
          display: { xs: "none", md: "block" },
          overflow: "hidden",
          filter: "saturate(1.06)",
        }}
      >
        {/* Background Layer 1 */}
        <img
          src={bg1}
          alt="background"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "left center",
          }}
        />

        {/* Background Layer 2 */}
        <img
          src={bg2}
          alt="background2"
          style={{
            position: "absolute",
            width: "50%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "left center",
            opacity: 0.78,
          }}
        />

        {/* Book */}
        <img
          src={bookImg}
          alt="book"
          style={{
            position: "absolute",
            width: "350px",
            top: "5%",
            left: "20%",
          }}
        />

        {/* Paper */}
        <img
          src={paperImg}
          alt="paper"
          style={{
            position: "absolute",
            width: "300px",
            top: "34%",
            left: "45%",
          }}
        />

        {/* Backpack */}
        <img
          src={backpackImg}
          alt="backpack"
          style={{
            position: "absolute",
            width: "260px",
            bottom: "0%",
            left: "0%",
          }}
        />
      </Box>

      {/* RIGHT SIDE — FULL HEIGHT, NO SCROLL */}
      <Box
        sx={{
          flex: 1,
          height: "100dvh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: { xs: 2, sm: 3 },
          overflow: "hidden",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            width: { xs: 240, sm: 340 },
            height: { xs: 240, sm: 340 },
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(116,178,255,0.38) 0%, rgba(116,178,255,0) 72%)",
            top: { xs: 10, sm: 24 },
            right: { xs: -60, sm: -70 },
            pointerEvents: "none",
          },
        }}
      >
        <Paper
          sx={{
            width: { xs: "min(94vw, 420px)", sm: "420px" },
            maxHeight: "calc(100dvh - 32px)",
            overflow: "hidden",
            padding: { xs: 2.5, sm: 3.5 },
            borderRadius: "26px",
            background: "linear-gradient(160deg, #4ea0ed 0%, #3e89db 48%, #367dcc 100%)",
            color: "white",
            border: "1px solid rgba(255,255,255,0.26)",
            backdropFilter: "blur(8px)",
            boxShadow: "0 22px 55px rgba(19, 62, 130, 0.28)",
            fontFamily: "Poppins, sans-serif",
          }}
          elevation={6}
        >
          <Typography
            variant="h4"
            fontWeight={700}
            mb={0.75}
            letterSpacing={1.05}
            fontSize={{ xs: "1.8rem", sm: "2.1rem" }}
            sx={{ textShadow: "0 2px 14px rgba(0,0,0,0.17)" }}
          >
            WELCOME BACK
          </Typography>

          <Typography variant="body1" mb={2.6} sx={{ opacity: 0.95, fontSize: "0.95rem", color: "#ecf5ff" }}>
            Welcome back! Please enter your details.
          </Typography>

          {/* Email */}
          <Typography mb={0.55} sx={{ fontSize: "0.88rem", fontWeight: 600, color: "#f3f9ff" }}>
            Email
          </Typography>
          <TextField
            size="small"
            placeholder="Enter your email"
            type="email"
            fullWidth
            sx={{
              mb: 1.5,
              "& .MuiInputBase-input": {
                color: "white",
                fontSize: "0.9rem",
              },
              "& .MuiInputBase-input::placeholder": {
                color: "rgba(239,247,255,0.78)",
                opacity: 1,
              },
              "& .MuiOutlinedInput-root": {
                background: "rgba(255,255,255,0.1)",
                borderRadius: "12px",
                height: 36,
                "& fieldset": {
                  borderColor: "rgba(255,255,255,0.38)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(255,255,255,0.75)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "white",
                },
              },
            }}
          />

          {/* Password */}
          <Typography mb={0.55} sx={{ fontSize: "0.88rem", fontWeight: 600, color: "#f3f9ff" }}>
            Password
          </Typography>
          <TextField
            size="small"
            placeholder="********"
            type="password"
            fullWidth
            sx={{
              mb: 1.5,
              "& .MuiInputBase-input": {
                color: "white",
                fontSize: "0.9rem",
              },
              "& .MuiInputBase-input::placeholder": {
                color: "rgba(239,247,255,0.78)",
                opacity: 1,
              },
              "& .MuiOutlinedInput-root": {
                background: "rgba(255,255,255,0.1)",
                borderRadius: "12px",
                height: 36,
                "& fieldset": {
                  borderColor: "rgba(255,255,255,0.38)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(255,255,255,0.75)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "white",
                },
              },
            }}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1.5,
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  sx={{
                    color: "rgba(240,248,255,0.8)",
                    p: 0.5,
                    "&.Mui-checked": { color: "white" },
                  }}
                />
              }
              label="Remember me"
              sx={{ color: "#f1f8ff", m: 0, "& .MuiFormControlLabel-label": { fontSize: "0.86rem" } }}
            />

            <Typography
              component={RouterLink}
              to="/forgot-password"
              sx={{
                cursor: "pointer",
                fontSize: "0.86rem",
                color: "#f1f8ff",
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Forgot password
            </Typography>
          </Box>

          {/* Sign-in Button */}
          <Button
            variant="contained"
            fullWidth
            sx={{
              background: "linear-gradient(180deg, #1f58cc 0%, #1448b0 100%)",
              py: 1,
              mb: 1.5,
              borderRadius: "12px",
              fontWeight: 600,
              letterSpacing: 0.3,
              fontSize: "1rem",
              textTransform: "none",
              boxShadow: "0 10px 22px rgba(12, 53, 138, 0.35)",
              "&:hover": {
                background: "linear-gradient(180deg, #2a63d8 0%, #1a52bb 100%)",
                boxShadow: "0 14px 26px rgba(12, 53, 138, 0.4)",
              },
            }}
          >
            Sign in
          </Button>

          {/* Google Sign-in Button */}
          <Button
            fullWidth
            sx={{
              background: "rgba(255,255,255,0.09)",
              border: "1px solid rgba(255,255,255,0.4)",
              py: 0.9,
              borderRadius: "12px",
              fontWeight: 600,
              color: "#f7fbff",
              display: "flex",
              gap: 1.5,
              alignItems: "center",
              textTransform: "none",
              fontSize: "0.95rem",
              "&:hover": {
                background: "rgba(255,255,255,0.16)",
                borderColor: "rgba(255,255,255,0.72)",
              },
            }}
          >
            <Box
              component="img"
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              sx={{ width: 20, height: 20 }}
            />
            Sign in with Google
          </Button>

          <Typography textAlign="center" mt={1.85} sx={{ opacity: 0.96, fontSize: "0.76rem", color: "#f2f8ff" }}>
            Don&apos;t have an account?{" "}
            <Typography
              component={RouterLink}
              to="/register"
              sx={{
                color: "#ffe16f",
                cursor: "pointer",
                fontWeight: 700,
                display: "inline",
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Sign up for free!
            </Typography>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}