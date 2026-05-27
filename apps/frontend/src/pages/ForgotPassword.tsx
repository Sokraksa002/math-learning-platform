import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setMessage("");

    if (!email) {
      setError("Please enter your email");
      return;
    }

    try {
      // ✅ CALL BACKEND
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      setMessage("Password reset link sent to your email");
    } catch {
      setError("Something went wrong");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg,#6366F1,#4F46E5)",
      }}
    >
      <Paper sx={{ p: 4, width: 350 }}>
        <Typography fontSize={24} fontWeight={800}>
          Forgot Password
        </Typography>

        <Typography fontSize={13} mb={2}>
          Enter your email to reset password
        </Typography>

        <TextField
          fullWidth
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {error && <Alert severity="error">{error}</Alert>}
        {message && <Alert severity="success">{message}</Alert>}

        <Button
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleSubmit}
        >
          Send Reset Link
        </Button>
      </Paper>
    </Box>
  );
}