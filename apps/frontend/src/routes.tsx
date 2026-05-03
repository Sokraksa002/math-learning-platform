import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Quiz from "./pages/Quiz";
import Chapter from "./pages/Chapter";
import Flashcard from "./pages/Flashcard";
import LessonDetail from "./pages/LessonDetail";
import Quizepaper from "./components/Quiz/Quizepaper";
import Focus from "./pages/Focus";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/quiz/paper/:chapterId" element={<Quizepaper />} />
        <Route path="/chapter" element={<Chapter />} />
        <Route path="/lesson/:lessonId" element={<LessonDetail />} />
        <Route path="/flashcard" element={<Flashcard />} />
        <Route path="/focus" element={<Focus/>} />
      </Routes>
    </BrowserRouter>
  );
}