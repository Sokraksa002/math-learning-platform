import { BrowserRouter, Routes, Route } from "react-router-dom";

// PUBLIC
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";
import Login from "./pages/Login";
import Register from "./pages/Register";

// FEATURE
import Quiz from "./pages/Quiz";
import Flashcard from "./pages/Flashcard";
import Chapter from "./pages/Chapter";
import LessonDetail from "./pages/LessonDetail";
import Focus from "./pages/Focus";
import Calendar from "./pages/Calendar";
import ChapterLessons from "./pages/ChapterLessons";

// USER
import Profile from "./pages/Profile";
import Certificate from "./pages/Certificate";
import Dashboard from "./pages/Dashboard";

// ADMIN
import AdminDashboard from "./pages/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageQuizzes from "./pages/admin/ManageQuizzes";
import ManageLessons from "./pages/admin/ManageLessons";
import VerifyCertificates from "./pages/admin/VerifyCertificates";

// COMPONENTS
import Quizepaper from "./components/Quiz/Quizepaper";
import ManageProfile from "./components/Profile/ManageProfile";
import Security from "./components/Profile/Security";
import Notifications from "./components/Profile/Notifications";
import QuizHistory from "./components/Profile/QuizHistory";
import FlashcardHistory from "./pages/FlashcardHistory";
import Ability from "./pages/Ability";

// ROUTING
import ProtectedRoute from "./routes/ProtectedRoute";
import MainLayout from "./components/Layout/MainLayout";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ✅ PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ✅ MAIN LAYOUT */}
        <Route element={<MainLayout />}>

          {/* HOME */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />

          {/* LEARNING */}
          <Route path="/chapter" element={<Chapter />} />
          <Route path="/chapter/:chapterId" element={<ChapterLessons />} />
          <Route path="/lesson/:lessonId" element={<LessonDetail />} />

          {/* TOOLS */}
          <Route path="/flashcard" element={<Flashcard />} />
          <Route path="/focus" element={<Focus />} />
          <Route path="/calendar" element={<Calendar />} />

          {/* HISTORY */}
          <Route path="/quiz-history" element={<QuizHistory />} />
          <Route path="/flashcard-history" element={<FlashcardHistory />} />
          <Route path="/ability" element={<Ability />} />

          <Route path="/certificate" element={<Certificate />} />

          {/* ✅ PROTECTED ROUTES */}
          <Route
            path="/quiz"
            element={
              <ProtectedRoute>
                <Quiz />
              </ProtectedRoute>
            }
          />

          <Route
            path="/quiz/:lessonId"
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
            path="/profile/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
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

          {/* ✅ ADMIN */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute
                allowedRoles={["admin"]}
                redirectTo="/dashboard"
              >
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute
                allowedRoles={["admin"]}
                redirectTo="/dashboard"
              >
                <ManageUsers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/quizzes"
            element={
              <ProtectedRoute
                allowedRoles={["admin"]}
                redirectTo="/dashboard"
              >
                <ManageQuizzes />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/lessons"
            element={
              <ProtectedRoute
                allowedRoles={["admin"]}
                redirectTo="/dashboard"
              >
                <ManageLessons />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/certificates"
            element={
              <ProtectedRoute
                allowedRoles={["admin"]}
                redirectTo="/dashboard"
              >
                <VerifyCertificates />
              </ProtectedRoute>
            }
          />

        </Route>

        {/* ✅ FALLBACK */}
        <Route path="*" element={<Home />} />

      </Routes>
    </BrowserRouter>
  );
}