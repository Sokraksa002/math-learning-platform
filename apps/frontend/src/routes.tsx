import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Quiz from "./pages/Quiz";
import Chapter from "./pages/Chapter";
import Flashcard from "./pages/Flashcard";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/chapter" element={<Chapter />} />
        <Route path="/flashcard" element={<Flashcard />} />
      </Routes>
    </BrowserRouter>
  );
}