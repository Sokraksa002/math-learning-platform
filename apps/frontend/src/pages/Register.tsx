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
  InputAdornment,
  IconButton,
  LinearProgress,
} from "@mui/material";
import {
  Person,
  Email as EmailIcon,
  Lock,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // ✅ NEW
import { publicPost, saveToken } from "../utils/api"; // ✅ NEW

export default function Register() {
  const navigate = useNavigate(); // ✅ NEW

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  // ✅ Password strength
  const getStrength = () => {
    if (password.length < 6)
      return { label: "Weak", value: 30, color: "red" };

    if (/[A-Z]/.test(password) && /[0-9]/.test(password))
      return {
        label: "Strong",
        value: 100,
        color: "#10B981",
      };

    return {
      label: "Medium",
      value: 60,
      color: "#F59E0B",
    };
  };

  const strength = getStrength();

  // ✅ UPDATED REGISTER HANDLER
  const handleRegister = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!fullName || !email || !password)
      return setError("Please fill all fields");

    if (password !== confirmPassword)
      return setError("Passwords do not match");

    if (!agreeTerms)
      return setError("Please accept terms");

    try {
      setLoading(true);

      // ✅ CALL API
      const res = await publicPost<{
        success: boolean;
        data: {
          token: string;
          user: { id: string; email: string };
        };
      }>("/api/auth/register", {
        name: fullName,
        email,
        password,
      });

      // ✅ AUTO LOGIN
      saveToken(res.data.token);

      setSuccess("Account created successfully!");

      // ✅ REDIRECT TO HOME
      setTimeout(() => {
        navigate("/");
      }, 600);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Registration failed");
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
          "linear-gradient(135deg,#0096c7,#0096c7,#4338CA)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Paper
          component="form"
          onSubmit={handleRegister}
          sx={{
            width: 380,
            p: 4,
            borderRadius: 4,
            backdropFilter: "blur(12px)",
            background: "rgba(255,255,255,0.08)",
            color: "#fff",
            boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
          }}
        >
          <Typography fontSize={26} fontWeight={800} mb={1}>
            Create Account 🚀
          </Typography>

          <Typography fontSize={14} mb={2} sx={{ opacity: 0.85 }}>
            Start your journey today
          </Typography>

          {/* NAME */}
          <TextField
            placeholder="Full Name"
            fullWidth
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person sx={{ color: "#fff" }} />
                </InputAdornment>
              ),
            }}
          />

          {/* EMAIL */}
          <TextField
            placeholder="Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ color: "#fff" }} />
                </InputAdornment>
              ),
            }}
          />

          {/* PASSWORD */}
          <TextField
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: "#fff" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
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

          {/* STRENGTH */}
          {password && (
            <>
              <LinearProgress
                variant="determinate"
                value={strength.value}
                sx={{
                  height: 6,
                  borderRadius: 5,
                  mb: 1,
                  background: "#ffffff33",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: strength.color,
                  },
                }}
              />
              <Typography fontSize={12} mb={1}>
                Strength: {strength.label}
              </Typography>
            </>
          )}

          {/* CONFIRM */}
          <TextField
            placeholder="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            fullWidth
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            sx={{ mb: 2 }}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >
                  {showConfirmPassword ? (
                    <VisibilityOff />
                  ) : (
                    <Visibility />
                  )}
                </IconButton>
              ),
            }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={agreeTerms}
                onChange={(e) =>
                  setAgreeTerms(e.target.checked)
                }
              />
            }
            label="I agree to terms"
          />

          {error && <Alert severity="error">{error}</Alert>}
          {success && (
            <Alert severity="success">{success}</Alert>
          )}

          <Button
            type="submit"
            fullWidth
            disabled={loading}
            sx={{
              mt: 2,
              py: 1.2,
              borderRadius: 2,
              fontWeight: 700,
              background:
                "linear-gradient(135deg,#ffff)",
            }}
          >
            {loading ? <CircularProgress size={20} /> : "Register"}
          </Button>
        </Paper>
      </motion.div>
    </Box>
  );
}
