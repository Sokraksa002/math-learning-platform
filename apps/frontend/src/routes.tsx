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
import ManageUsers from "./pages/admin/ManageUsers";
import ManageQuizzes from "./pages/admin/ManageQuizzes";
import ManageLessons from "./pages/admin/ManageLessons";
import VerifyCertificates from "./pages/admin/VerifyCertificates";

import Quizepaper from "./components/Quiz/Quizepaper";
import ManageProfile from "./components/Profile/ManageProfile";
import Security from "./components/Profile/Security";
import Notifications from "./components/Profile/Notifications";
import QuizHistory from "./components/Profile/QuizHistory.tsx";
import FlashcardHistory from "./pages/FlashcardHistory.tsx";
import Ability from "./pages/Ability.tsx";

import ProtectedRoute from "./routes/ProtectedRoute";
import MainLayout from "./components/Layout/MainLayout";
import { AuthModalProvider } from "./contexts/AuthModalContext";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthModalProvider>
        <MainLayout>
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
              <ProtectedRoute allowedRoles={["student"]} redirectTo="/admin">
                <Quiz />
              </ProtectedRoute>
            }
          />

          <Route
            path="/quiz/paper/:chapterId"
            element={
              <ProtectedRoute allowedRoles={["student"]} redirectTo="/admin">
                <Quizepaper />
              </ProtectedRoute>
            }
          />

          <Route
            path="/chapter"
            element={
              <ProtectedRoute allowedRoles={["student"]} redirectTo="/admin">
                <Chapter />
              </ProtectedRoute>
            }
          />

          <Route
            path="/lesson/:lessonId"
            element={
              <ProtectedRoute allowedRoles={["student"]} redirectTo="/admin">
                <LessonDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/flashcard"
            element={
              <ProtectedRoute allowedRoles={["student"]} redirectTo="/admin">
                <Flashcard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/focus"
            element={
              <ProtectedRoute allowedRoles={["student"]} redirectTo="/admin">
                <Focus />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={["student"]} redirectTo="/admin">
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile/manage"
            element={
              <ProtectedRoute allowedRoles={["student"]} redirectTo="/admin">
                <ManageProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile/security"
            element={
              <ProtectedRoute allowedRoles={["student"]} redirectTo="/admin">
                <Security />
              </ProtectedRoute>
            }
          />

          <Route
            path="/quiz-history"
            element={
              <ProtectedRoute allowedRoles={["student"]} redirectTo="/admin">
                <QuizHistory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/flashcard-history"
            element={
              <ProtectedRoute allowedRoles={["student"]} redirectTo="/admin">
                <FlashcardHistory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ability"
            element={
              <ProtectedRoute allowedRoles={["student"]} redirectTo="/admin">
                <Ability />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile/notifications"
            element={
              <ProtectedRoute allowedRoles={["student"]} redirectTo="/admin">
                <Notifications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/certificate"
            element={
              <ProtectedRoute allowedRoles={["student"]} redirectTo="/admin">
                <Certificate />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["student"]} redirectTo="/admin">
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]} redirectTo="/dashboard">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={["admin"]} redirectTo="/dashboard">
                <ManageUsers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/quizzes"
            element={
              <ProtectedRoute allowedRoles={["admin"]} redirectTo="/dashboard">
                <ManageQuizzes />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/lessons"
            element={
              <ProtectedRoute allowedRoles={["admin"]} redirectTo="/dashboard">
                <ManageLessons />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/certificates"
            element={
              <ProtectedRoute allowedRoles={["admin"]} redirectTo="/dashboard">
                <VerifyCertificates />
              </ProtectedRoute>
            }
          />

          </Routes>
        </MainLayout>
      </AuthModalProvider>
    </BrowserRouter>
  );
}