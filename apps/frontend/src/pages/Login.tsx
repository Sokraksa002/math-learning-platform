import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";

import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { login as apiLogin, saveToken } from "../utils/api";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await apiLogin(email, password);

      if (!res?.token || !res?.user) {
        throw new Error("Invalid email or password");
      }

      saveToken(res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      if (remember) {
        localStorage.setItem("remember", "true");
      }

      // ✅ redirect back if needed
      const params = new URLSearchParams(location.search);
      const next = params.get("next");

      navigate(next ?? "/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg,#6366F1,#4F46E5,#4338CA)",
        px: 2,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          sx={{
            width: 380,
            p: 4,
            borderRadius: 4,
            backdropFilter: "blur(12px)",
            background: "rgba(255,255,255,0.1)",
            color: "#fff",
            boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
          }}
        >
          {/* ✅ HEADER */}
          <Typography fontSize={26} fontWeight={800} mb={1}>
            Welcome back 👋
          </Typography>

          <Typography mb={3} sx={{ opacity: 0.85 }}>
            Login to continue learning
          </Typography>

          {/* ✅ EMAIL */}
          <TextField
            label="Email"
            fullWidth
            size="small"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: "#fff" }} />
                </InputAdornment>
              ),
            }}
          />

          {/* ✅ PASSWORD */}
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            size="small"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            onKeyDown={(e) =>
              e.key === "Enter" && handleLogin()
            }
            sx={{ mb: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: "#fff" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <IconButton
                  onClick={() => setShowPassword((prev) => !prev)}
                  sx={{ color: "white" }}
                >
                  {showPassword ? (
                    <VisibilityOff />
                  ) : (
                    <Visibility />
                  )}
                </IconButton>
              ),
            }}
          />

          {/* ✅ FORGOT PASSWORD */}
          <Typography
            component={Link}
            to="/forgot-password"
            sx={{
              display: "block",
              textAlign: "right",
              fontSize: 13,
              mb: 1,
              color: "#E0E7FF",
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Forgot password?
          </Typography>

          {/* ✅ ERROR */}
          {error && (
            <Alert severity="error" sx={{ mb: 1 }}>
              {error}
            </Alert>
          )}

          {/* ✅ REMEMBER */}
          <FormControlLabel
            control={
              <Checkbox
                checked={remember}
                onChange={(e) =>
                  setRemember(e.target.checked)
                }
                sx={{ color: "#fff" }}
              />
            }
            label="Remember me"
          />

          {/* ✅ LOGIN BUTTON */}
          <Button
            fullWidth
            onClick={handleLogin}
            disabled={loading}
            sx={{
              mt: 2,
              py: 1.2,
              borderRadius: 2,
              fontWeight: 700,
              background:
                "linear-gradient(135deg,#7C3AED,#4F46E5)",
              boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
              "&:hover": {
                transform: "translateY(-2px)",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={20} sx={{ color: "#fff" }} />
            ) : (
              "Sign In"
            )}
          </Button>

          {/* ✅ FOOTER */}
          <Typography textAlign="center" mt={2} fontSize={14}>
            Don't have an account?{" "}
            <Typography
              component={Link}
              to="/register"
              sx={{
                fontWeight: 700,
                color: "#C7D2FE",
                textDecoration: "none",
              }}
            >
              Sign up
            </Typography>
          </Typography>
        </Paper>
      </motion.div>
    </Box>
  );
}
