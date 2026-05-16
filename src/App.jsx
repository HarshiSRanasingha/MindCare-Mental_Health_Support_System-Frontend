import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./routes/ProtectedRoute";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import StudentDashboard from "./pages/StudentDashboard";
import CounselorDashboard from "./pages/CounselorDashboard";
import RequestDetailsPage from "./pages/RequestDetailsPage";
import CounselorsListPage from "./pages/CounselorsListPage";
import UsersListPage from "./pages/UsersListPage";
import ProfilePage from "./pages/ProfilePage";
import MindfulnessTimer from "./pages/MindfulnessTimer";
import SelfTherapyPage from "./pages/SelfTherapyPage";
import MoodTracker from "./pages/MoodTracker";
import DailyJournal from "./pages/DailyJournal";
import AcademicManager from "./pages/AcademicManager";

const RootRedirect = () => {
  const { user } = useAuth();
  if (!user) return <LandingPage />;
  return <Navigate to={user.role === "student" ? "/student/dashboard" : "/counselor/dashboard"} replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="bg-decorations">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
        </div>
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Public */}
            <Route path="/" element={<RootRedirect />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Student Routes */}
            <Route path="/student/dashboard" element={
              <ProtectedRoute allowedRole="student"><StudentDashboard /></ProtectedRoute>
            } />
            <Route path="/calm" element={
              <ProtectedRoute allowedRole="student"><MindfulnessTimer /></ProtectedRoute>
            } />
            <Route path="/therapy" element={
              <ProtectedRoute allowedRole="student"><SelfTherapyPage /></ProtectedRoute>
            } />
            <Route path="/mood-tracker" element={
              <ProtectedRoute allowedRole="student"><MoodTracker /></ProtectedRoute>
            } />
            <Route path="/journal" element={
              <ProtectedRoute allowedRole="student"><DailyJournal /></ProtectedRoute>
            } />
            <Route path="/academic-manager" element={
              <ProtectedRoute allowedRole="student"><AcademicManager /></ProtectedRoute>
            } />

            {/* Counselor Routes */}
            <Route path="/counselor/dashboard" element={
              <ProtectedRoute allowedRole="counselor"><CounselorDashboard /></ProtectedRoute>
            } />
            <Route path="/counselor/request/:id" element={
              <ProtectedRoute allowedRole="counselor"><RequestDetailsPage /></ProtectedRoute>
            } />

            {/* Shared Protected Routes */}
            <Route path="/counselors" element={
              <ProtectedRoute><CounselorsListPage /></ProtectedRoute>
            } />
            <Route path="/users" element={
              <ProtectedRoute><UsersListPage /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><ProfilePage /></ProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
