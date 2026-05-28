import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/shared/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import BottomNav from './components/layout/BottomNav';
import ClickSpark from './components/UI/ClickSpark';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import AddHabitPage from './pages/AddHabitPage';
import HabitDetailPage from './pages/HabitDetailPage';
import ProgressPage from './pages/ProgressPage';

// Layout wrapper for protected pages to show navigation
const AppLayout = () => {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-textPrimary flex flex-col pb-16 md:pb-0">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

function App() {
  return (
    <ClickSpark
      sparkColor="#ffffffff"
      sparkSize={8}
      sparkRadius={16}
      sparkCount={8}
      duration={450}
      easing="ease-out"
      extraScale={0.9}
    >
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/add-habit" element={<AddHabitPage />} />
                <Route path="/habit/:id" element={<HabitDetailPage />} />
                <Route path="/progress" element={<ProgressPage />} />
              </Route>
            </Route>

            {/* Fallback Catch-All */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ClickSpark>
  );
}

export default App;