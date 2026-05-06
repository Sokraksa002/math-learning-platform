import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register.tsx";
import ForgotPassword from "./pages/ForgotPassword";

import Quiz from "./pages/Quiz";
import Flashcard from "./pages/Flashcard";
import Chapter from "./pages/Chapter";
import LessonDetail from "./pages/LessonDetail";
import Focus from "./pages/Focus";

import Profile from "./pages/Profile";
import Certificate from "./pages/Certificate";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";

import Quizepaper from "./components/Quiz/Quizepaper";
import ManageProfile from "./components/Profile/ManageProfile";
import Security from "./components/Profile/Security";
import Notifications from "./components/Profile/Notifications";
import QuizHistory from "./components/Profile/QuizHistory.tsx";
import FlashcardHistory from "./pages/FlashcardHistory.tsx";
import Ability from "./pages/Ability.tsx";

import ProtectedRoute from "./routes/ProtectedRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Routes */}
        <Route
          path="/quiz"
          element={
            <ProtectedRoute>
              <Quiz />
            </ProtectedRoute>
          }
        />

        <Route
          path="/quiz/paper/:chapterId"
          element={
            <ProtectedRoute>
              <Quizepaper />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chapter"
          element={
            <ProtectedRoute>
              <Chapter />
            </ProtectedRoute>
          }
        />

        <Route
          path="/lesson/:lessonId"
          element={
            <ProtectedRoute>
              <LessonDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/flashcard"
          element={
            <ProtectedRoute>
              <Flashcard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/focus"
          element={
            <ProtectedRoute>
              <Focus />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/manage"
          element={
            <ProtectedRoute>
              <ManageProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/security"
          element={
            <ProtectedRoute>
              <Security />
            </ProtectedRoute>
          }
        />

        <Route
          path="/quiz-history"
          element={
            <ProtectedRoute>
              <QuizHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/flashcard-history"
          element={
            <ProtectedRoute>
              <FlashcardHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ability"
          element={
            <ProtectedRoute>
              <Ability />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/certificate/:chapterId"
          element={
            <ProtectedRoute>
              <Certificate />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}