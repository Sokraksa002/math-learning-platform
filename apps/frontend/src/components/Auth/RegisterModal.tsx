import { Dialog, DialogContent, Typography, TextField, Button, Box, FormControlLabel, Checkbox, Alert } from "@mui/material";
import { useState } from "react";
import { useAuthModal } from "../../contexts/AuthModalContext";
import { useNavigate } from "react-router-dom";
import { colorPalette } from "../../theme/colorPalette";

type StoredUser = {
  id: string;
  fullName: string;
  email: string;
  password: string;
  role: "student";
  createdAt: string;
};

export default function RegisterModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { openLogin } = useAuthModal();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleRegister = async (e?: React.FormEvent) => {
    e?.preventDefault();
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
      const newUser: StoredUser = { id: Date.now().toString(), fullName, email, password, role: "student", createdAt: new Date().toISOString() };
      existingUsers.push(newUser);
      localStorage.setItem("registeredUsers", JSON.stringify(existingUsers));
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => {
        onClose();
        openLogin();
      }, 900);
    } catch {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogContent>
        <Box sx={{ py: 2 }} component="form" onSubmit={handleRegister}>
          <Typography variant="h6" fontWeight={700} mb={0.5}>Create account</Typography>
          <Typography mb={1} sx={{ color: colorPalette.text.secondary }}>Create your account and start learning.</Typography>

          <TextField size="small" placeholder="Full name" fullWidth value={fullName} onChange={(e) => setFullName(e.target.value)} sx={{ mb: 1 }} />
          <TextField size="small" placeholder="Email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} sx={{ mb: 1 }} />
          <TextField size="small" placeholder="Password" type="password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} sx={{ mb: 1 }} />
          <TextField size="small" placeholder="Confirm password" type="password" fullWidth value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} sx={{ mb: 1 }} />

          <FormControlLabel control={<Checkbox size="small" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} sx={{ color: colorPalette.primary.main }} />} label="I agree to the terms and conditions" sx={{ mb: 1 }} />

          {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 1 }}>{success}</Alert>}

          <Button type="submit" fullWidth disabled={loading} sx={{ background: colorPalette.primary.main, color: 'white', '&:hover': { background: colorPalette.primary.dark } }}>{loading ? '...' : 'Register'}</Button>

          <Typography textAlign="center" mt={2}>Already have an account? <Button onClick={() => { onClose(); openLogin(); }} sx={{ color: colorPalette.accent.yellow, fontWeight: 700 }}>Sign in</Button></Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
