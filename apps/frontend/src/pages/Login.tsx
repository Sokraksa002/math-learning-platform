import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLocale } from "../hooks/useLocale";

// Images
import bookImg from "../assets/Login/Book.png";
import paperImg from "../assets/Login/Paper.png";
import backpackImg from "../assets/Login/backpack.png";
import bg1 from "../assets/Login/bg1.png";
import bg2 from "../assets/Login/bg2.png";

type UserRole = "admin" | "student";

interface MockUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

interface LoginResult {
  success: boolean;
  message?: string;
  user?: Omit<MockUser, "password">;
}

/* ================= MOCK USERS ================= */
const mockUsers = [
  {
    id: 1,
    name: "Admin",
    email: "admin@school.com",
    password: "Admin@123",
    role: "admin",
  },
  {
    id: 2,
    name: "Student One",
    email: "student1@gmail.com",
    password: "student123",
    role: "student",
  },
];

/* ================= LOGIN FUNCTION ================= */
const mockLogin = (email: string, password: string): LoginResult => {
  const user = mockUsers.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return { success: false, message: "Invalid email or password" };
  }

  return {
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as UserRole,
    },
  };
};

export default function Login() {
  const navigate = useNavigate();
  const { t } = useLocale();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const result = mockLogin(email, password);

    if (!result.success) {
      setError(result.message ?? "Invalid email or password");
      return;
    }

    if (!result.user) {
      setError("Login failed. Please try again.");
      return;
    }

    // Save session
    localStorage.setItem("user", JSON.stringify(result.user));

    // Role-based redirect
    if (result.user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/dashboard");
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
        background:
          "radial-gradient(circle at 12% 16%, #fefefe 0%, #f4f6fb 45%, #ebedf4 100%)",
      }}
    >
      {/* ========== LEFT SIDE ========== */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "block" },
          position: "relative",
        }}
      >
        <img src={bg1} alt="" style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} />
        <img src={bg2} alt="" style={{ position: "absolute", width: "50%", height: "100%", opacity: 0.8 }} />
        <img src={bookImg} alt="" style={{ position: "absolute", width: 350, top: "6%", left: "20%" }} />
        <img src={paperImg} alt="" style={{ position: "absolute", width: 300, top: "34%", left: "45%" }} />
        <img src={backpackImg} alt="" style={{ position: "absolute", width: 260, bottom: 0 }} />
      </Box>

      {/* ========== RIGHT SIDE ========== */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
        }}
      >
        <Paper
          sx={{
            width: 420,
            p: 3.5,
            borderRadius: "26px",
            background: "linear-gradient(160deg,#4ea0ed,#367dcc)",
            color: "white",
          }}
        >
          <Typography variant="h4" fontWeight={700} mb={1}>
            WELCOME BACK
          </Typography>

          <Typography mb={2} sx={{ opacity: 0.95 }}>
            Please enter your login details.
          </Typography>

          {/* EMAIL */}
          <TextField
            placeholder={t('pages.Login.email', 'Email')}
            fullWidth
            size="small"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 1.5 }}
          />

          {/* PASSWORD */}
          <TextField
            placeholder={t('pages.Login.password', 'Password')}
            type="password"
            fullWidth
            size="small"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 1.5 }}
          />

          {/* ERROR */}
          {error && (
            <Typography sx={{ color: "#ffdede", mb: 1, fontSize: "0.85rem" }}>
              {error}
            </Typography>
          )}

          <FormControlLabel
            control={<Checkbox sx={{ color: "white" }} />}
            label={t('pages.Login.remember_me', 'Remember me')}
          />

          {/* LOGIN BUTTON */}
          <Button
            fullWidth
            onClick={handleLogin}
            sx={{
              mt: 2,
              background: "#1f58cc",
              color: "white",
              borderRadius: "12px",
              py: 1,
              "&:hover": { background: "#1749a6" },
            }}
          >
            Sign in
          </Button>

          {/* GOOGLE MOCK */}
          <Button
            fullWidth
            sx={{
              mt: 1.5,
              border: "1px solid white",
              color: "white",
            }}
          >
            Sign in with Google
          </Button>

          <Typography textAlign="center" mt={2} fontSize="0.8rem">
            Don&apos;t have an account?{" "}
            <Typography
              component={RouterLink}
              to="/register"
              sx={{ color: "#ffe16f", fontWeight: 700 }}
            >
              Sign up
            </Typography>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}