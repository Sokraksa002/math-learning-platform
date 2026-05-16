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
import { colorPalette } from "../theme/colorPalette";

// Images
import bookImg from "../assets/Login/Book.png";
import paperImg from "../assets/Login/Paper.png";
import backpackImg from "../assets/Login/backpack.png";
import bg1 from "../assets/Login/bg1.png";
import bg2 from "../assets/Login/bg2.png";

/* ================= TYPES ================= */

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

const defaultMockUsers: MockUser[] = [
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
  const registeredUsers = JSON.parse(
    localStorage.getItem("registeredUsers") || "[]"
  );

  const registeredUser = registeredUsers.find(
    (u: any) => u.email === email && u.password === password
  );

  if (registeredUser) {
    const { password: _, ...safeUser } = registeredUser;
    return { success: true, user: safeUser };
  }

  const user = defaultMockUsers.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return { success: false, message: "Invalid email or password" };
  }

  const { password: _, ...safeUser } = user;
  return { success: true, user: safeUser };
};

/* ================= COMPONENT ================= */

export default function Login() {
  const navigate = useNavigate();
  const { t } = useLocale();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);
    setError("");

    const result = mockLogin(email, password);

    setTimeout(() => {
      setLoading(false);

      if (!result.success || !result.user) {
        setError(result.message || "Login failed");
        return;
      }

      localStorage.setItem("user", JSON.stringify(result.user));
      if (remember) localStorage.setItem("remember", "true");

      navigate(result.user.role === "admin" ? "/admin" : "/dashboard");
    }, 600);
  };

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        display: "flex",
        background: `radial-gradient(circle at 12% 16%, ${colorPalette.background.light} 0%, ${colorPalette.background.lighter} 45%, ${colorPalette.background.default} 100%)`,
      }}
    >
      {/* ========== LEFT PANEL ========== */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "block" },
          position: "relative",
          overflow: "hidden", // ✅ PREVENT BLEEDING
        }}
      >
        {/* Backgrounds */}
        <img
          src={bg1}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
          }}
        />

        <img
          src={bg2}
          alt=""
          style={{
            position: "absolute",
            top: 0,
            right: "-10%",
            width: "60%",
            height: "100%",
            opacity: 0.85,
            zIndex: 1,
          }}
        />

        {/* Illustrations */}
        <img
          src={bookImg}
          alt="Book"
          style={{
            position: "absolute",
            width: 350,
            top: "6%",
            left: "18%",
            zIndex: 2,
          }}
        />

        <img
          src={paperImg}
          alt="Paper"
          style={{
            position: "absolute",
            width: 300,
            top: "34%",
            left: "46%",
            zIndex: 2,
          }}
        />

        <img
          src={backpackImg}
          alt="Backpack"
          style={{
            position: "absolute",
            width: 260,
            bottom: "-8px",
            left: "14%",
            zIndex: 2,
          }}
        />
      </Box>

      {/* ========== RIGHT PANEL ========== */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          zIndex: 10,
        }}
      >
        <Paper
          sx={{
            width: 420,
            p: 4,
            borderRadius: 4,
            background: `linear-gradient(160deg, ${colorPalette.primary.light}, ${colorPalette.primary.main})`,
            color: "white",
            position: "relative",
            zIndex: 10,
            boxShadow: "0 20px 40px rgba(0,0,0,0.18)",
          }}
        >
          <Typography variant="h4" fontWeight={700}>
            {t("pages.Login.welcome", "Welcome back")}
          </Typography>

          <Typography mb={2} sx={{ opacity: 0.95 }}>
            {t(
              "pages.Login.subtitle",
              "Please enter your login details"
            )}
          </Typography>

          <TextField
            placeholder={t("pages.Login.email", "Email")}
            fullWidth
            size="small"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            sx={{
              mb: 1.5,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "rgba(255,255,255,0.9)",
              },
            }}
          />

          <TextField
            placeholder={t("pages.Login.password", "Password")}
            type="password"
            fullWidth
            size="small"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            sx={{
              mb: 1.5,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "rgba(255,255,255,0.9)",
              },
            }}
          />

          {error && (
            <Typography sx={{ color: "#ffdede", mb: 1, fontSize: 13 }}>
              {error}
            </Typography>
          )}

          <FormControlLabel
            control={
              <Checkbox
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                sx={{ color: "white", "&.Mui-checked": { color: colorPalette.primary.dark } }}
              />
            }
            label={t("pages.Login.remember_me", "Remember me")}
          />

          <Button
            fullWidth
            disabled={loading}
            onClick={handleLogin}
            sx={{
              mt: 2,
              background: colorPalette.primary.dark,
              color: "white",
              borderRadius: 2,
              py: 1,
              "&:hover": { background: colorPalette.primary.main },
            }}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>

          <Button
            fullWidth
            sx={{
              mt: 1.5,
              border: `1px solid ${colorPalette.border}`,
              color: colorPalette.text.primary,
              opacity: 0.95,
            }}
            disabled
          >
            Sign in with Google
          </Button>

          <Typography textAlign="center" mt={2} fontSize={12}>
            Don&apos;t have an account?{" "}
            <Typography
              component={RouterLink}
              to="/register"
              sx={{ color: colorPalette.accent.yellow, fontWeight: 700 }}
            >
              Sign up
            </Typography>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}