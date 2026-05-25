import { Dialog, DialogContent, Typography, TextField, Button, Box, FormControlLabel, Checkbox } from "@mui/material";
import { useState } from "react";
import { useAuthModal } from "../../contexts/AuthModalContext";
import { useNavigate } from "react-router-dom";
import { colorPalette } from "../../theme/colorPalette";

type UserRole = "admin" | "student";

interface MockUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

const defaultMockUsers: MockUser[] = [
  { id: 1, name: "Admin", email: "admin@school.com", password: "Admin@123", role: "admin" },
  { id: 2, name: "Student One", email: "student1@gmail.com", password: "student123", role: "student" },
];

const mockLogin = (email: string, password: string) => {
  const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
  const registeredUser = registeredUsers.find((u: any) => u.email === email && u.password === password);
  if (registeredUser) {
    const { password: _, ...safeUser } = registeredUser;
    return { success: true, user: safeUser };
  }
  const user = defaultMockUsers.find((u) => u.email === email && u.password === password);
  if (!user) return { success: false, message: "Invalid email or password" };
  const { password: _, ...safeUser } = user;
  return { success: true, user: safeUser };
};

export default function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { openRegister } = useAuthModal();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!email || !password) return setError("Please enter email and password");
    setLoading(true);
    const result = mockLogin(email, password);
    setTimeout(() => {
      setLoading(false);
      if (!result.success || !result.user) return setError(result.message || "Login failed");
      localStorage.setItem("user", JSON.stringify(result.user));
      if (remember) localStorage.setItem("remember", "true");
      onClose();
      navigate(result.user.role === "admin" ? "/admin" : "/dashboard");
    }, 600);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogContent>
        <Box sx={{ py: 2 }}>
          <Typography variant="h6" fontWeight={700} mb={0.5}>
            Sign in
          </Typography>
          <Typography mb={1} sx={{ color: colorPalette.text.secondary }}>
            Enter your credentials to continue
          </Typography>

          <TextField placeholder="Email" fullWidth size="small" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} sx={{ mb: 1.25 }} />
          <TextField placeholder="Password" type="password" fullWidth size="small" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} sx={{ mb: 1.25 }} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />

          {error && <Typography sx={{ color: colorPalette.accent.red, mb: 1 }}>{error}</Typography>}

          <FormControlLabel control={<Checkbox checked={remember} onChange={(e) => setRemember(e.target.checked)} sx={{ color: colorPalette.primary.main }} />} label="Remember me" />

          <Button fullWidth onClick={handleLogin} disabled={loading} sx={{ mt: 1, background: colorPalette.primary.main, color: 'white', '&:hover': { background: colorPalette.primary.dark } }}>
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>

          <Button fullWidth disabled sx={{ mt: 1, border: `1px solid ${colorPalette.border}`, color: colorPalette.text.primary }}>Sign in with Google</Button>

          <Typography textAlign="center" mt={2}>
            Don't have an account? <Button onClick={() => { onClose(); openRegister(); }} sx={{ color: colorPalette.accent.yellow, fontWeight: 700 }}>Sign up</Button>
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

