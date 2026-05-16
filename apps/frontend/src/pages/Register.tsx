import { useState, type FormEvent } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useLocale } from "../hooks/useLocale";

import bookImg from "../assets/Login/Book.png";
import paperImg from "../assets/Login/Paper.png";
import backpackImg from "../assets/Login/backpack.png";
import bg1 from "../assets/Login/bg1.png";
import bg2 from "../assets/Login/bg2.png";

type StoredUser = {
  id: string;
  fullName: string;
  email: string;
  password: string;
  role: "student";
  createdAt: string;
};

const textFieldStyles = {
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
};

export default function Register() {
  const navigate = useNavigate();
  const { t } = useLocale();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!fullName.trim()) return setError("Full name is required");
    if (!email.trim()) return setError("Email is required");
    if (!validateEmail(email)) return setError("Please enter a valid email");
    if (password.length < 6) return setError("Password must be at least 6 characters");
    if (password !== confirmPassword) return setError("Passwords do not match");
    if (!agreeTerms) return setError("Please agree to the terms and conditions");

    const existingUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]") as StoredUser[];
    const alreadyExists = existingUsers.some((user) => user.email.toLowerCase() === email.toLowerCase());
    if (alreadyExists) return setError("Email already registered. Please login instead.");

    setLoading(true);
    try {
      const newUser: StoredUser = {
        id: Date.now().toString(),
        fullName,
        email,
        password,
        role: "student",
        createdAt: new Date().toISOString(),
      };

      existingUsers.push(newUser);
      localStorage.setItem("registeredUsers", JSON.stringify(existingUsers));

      setSuccess("Registration successful! Redirecting to login...");
      window.setTimeout(() => navigate("/login", { state: { email } }), 1200);
    } catch {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        height: "100dvh",
        width: "100vw",
        display: "flex",
        overflow: "hidden",
        background: "radial-gradient(circle at 12% 16%, #fefefe 0%, #f4f6fb 45%, #ebedf4 100%)",
      }}
    >
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
        <img src={bg1} alt={t('pages.Register.background', 'background')} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", objectPosition: "left center" }} />
        <img src={bg2} alt={t('pages.Register.background2', 'background2')} style={{ position: "absolute", width: "50%", height: "100%", objectFit: "cover", objectPosition: "left center", opacity: 0.78 }} />
        <img src={bookImg} alt={t('pages.Register.book', 'book')} style={{ position: "absolute", width: "350px", top: "5%", left: "20%" }} />
        <img src={paperImg} alt={t('pages.Register.paper', 'paper')} style={{ position: "absolute", width: "300px", top: "34%", left: "45%" }} />
        <img src={backpackImg} alt={t('pages.Register.backpack', 'backpack')} style={{ position: "absolute", width: "260px", bottom: "0%", left: "0%" }} />
      </Box>

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
          component="form"
          onSubmit={handleRegister}
          sx={{
            width: { xs: "min(94vw, 420px)", sm: "420px" },
            maxHeight: "calc(100dvh - 32px)",
            overflow: "auto",
            p: { xs: 2.5, sm: 3.5 },
            borderRadius: "26px",
            background: "linear-gradient(160deg, #4ea0ed 0%, #3e89db 48%, #367dcc 100%)",
            color: "white",
            border: "1px solid rgba(255,255,255,0.26)",
            backdropFilter: "blur(8px)",
            boxShadow: "0 22px 55px rgba(19, 62, 130, 0.28)",
          }}
          elevation={6}
        >
          <Typography variant="h4" fontWeight={700} mb={0.75} letterSpacing={1.05} fontSize={{ xs: "1.8rem", sm: "2.1rem" }} sx={{ textShadow: "0 2px 14px rgba(0,0,0,0.17)" }}>
            CREATE ACCOUNT
          </Typography>
          <Typography variant="body1" mb={2.6} sx={{ opacity: 0.95, fontSize: "0.95rem", color: "#ecf5ff" }}>
            Create your account and start learning smarter.
          </Typography>

          <Typography mb={0.55} sx={{ fontSize: "0.88rem", fontWeight: 600, color: "#f3f9ff" }}>{t('pages.Register.full_name', 'Full name')}</Typography>
          <TextField
            size="small"
            placeholder={t('pages.Register.enter_your_full_name', 'Enter your full name')}
            fullWidth
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            sx={textFieldStyles}
          />

          <Typography mb={0.55} sx={{ fontSize: "0.88rem", fontWeight: 600, color: "#f3f9ff" }}>{t('pages.Register.email', 'Email')}</Typography>
          <TextField
            size="small"
            placeholder={t('pages.Register.enter_your_email', 'Enter your email')}
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={textFieldStyles}
          />

          <Typography mb={0.55} sx={{ fontSize: "0.88rem", fontWeight: 600, color: "#f3f9ff" }}>{t('pages.Register.password', 'Password')}</Typography>
          <TextField
            size="small"
            placeholder={t('pages.Register.create_a_password', 'Create a password')}
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={textFieldStyles}
          />

          <Typography mb={0.55} sx={{ fontSize: "0.88rem", fontWeight: 600, color: "#f3f9ff" }}>{t('pages.Register.confirm_password', 'Confirm Password')}</Typography>
          <TextField
            size="small"
            placeholder={t('pages.Register.confirm_your_password', 'Confirm your password')}
            type="password"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={textFieldStyles}
          />

          <FormControlLabel
            control={<Checkbox size="small" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} sx={{ color: "rgba(240,248,255,0.8)", p: 0.5, "&.Mui-checked": { color: "white" } }} />}
            label={t('pages.Register.i_agree_to_the_terms_and_conditions', 'I agree to the terms and conditions')}
            sx={{ color: "#f1f8ff", mb: 1, m: 0, "& .MuiFormControlLabel-label": { fontSize: "0.86rem" } }}
          />

          {error && <Alert severity="error" sx={{ mb: 1.5, fontSize: "0.85rem", color: "#fff", backgroundColor: "rgba(211, 47, 47, 0.8)" }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 1.5, fontSize: "0.85rem", color: "#fff", backgroundColor: "rgba(56, 142, 60, 0.8)" }}>{success}</Alert>}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
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
              "&:hover": { background: "linear-gradient(180deg, #2a63d8 0%, #1a52bb 100%)", boxShadow: "0 14px 26px rgba(12, 53, 138, 0.4)" },
              "&:disabled": { opacity: 0.7 },
            }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Register"}
          </Button>

          <Typography textAlign="center" mt={1.6} sx={{ opacity: 0.96, fontSize: "0.8rem", color: "#f2f8ff" }}>
            Already have an account?{" "}
            <Typography component={RouterLink} to="/login" sx={{ color: "#ffe16f", fontWeight: 700, textDecoration: "none", display: "inline", "&:hover": { textDecoration: "underline" } }}>
              Sign in
            </Typography>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}