
import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import AnalysisPage from './pages/AnalysisPage';
import BudgetPage from './pages/BudgetPage';
import ChatPage from './pages/ChatPage';
import BillsPage from './pages/BillsPage';
import TaxPage from './pages/TaxPage';
import HouseholdPage from './pages/HouseholdPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import TourPage from './pages/TourPage';
import FaqPage from './pages/FaqPage';
import { api } from './services/api';
import { User } from './types';

const ProtectedRoute: React.FC<{ user: User | null; children: React.ReactNode }> = ({ user, children }) => {
  // If no user is found in state/storage, redirect to login
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const App: React.FC = () => {
  // Initialize state directly from localStorage so there's no "logged out" flash on refresh
  const [user, setUser] = useState<User | null>(() => api.getCurrentUser());
  const location = useLocation();

  // Keep the app state in sync with localStorage whenever the route changes
  // (e.g. if the user logs in/out in another tab or the session is updated)
  useEffect(() => {
    const currentUser = api.getCurrentUser();
    setUser(currentUser);
  }, [location.pathname]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/tour" element={<TourPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/faq" element={<FaqPage />} />

      {/* Auth Routes - Redirect to dashboard if already logged in */}
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <SignupPage />} />

      {/* Protected App Routes */}
      <Route path="/dashboard" element={<ProtectedRoute user={user}><DashboardPage /></ProtectedRoute>} />
      <Route path="/upload" element={<ProtectedRoute user={user}><UploadPage /></ProtectedRoute>} />
      <Route path="/analysis" element={<ProtectedRoute user={user}><AnalysisPage /></ProtectedRoute>} />
      <Route path="/budget" element={<ProtectedRoute user={user}><BudgetPage /></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute user={user}><ChatPage /></ProtectedRoute>} />
      <Route path="/bills" element={<ProtectedRoute user={user}><BillsPage /></ProtectedRoute>} />
      <Route path="/tax" element={<ProtectedRoute user={user}><TaxPage /></ProtectedRoute>} />
      <Route path="/household" element={<ProtectedRoute user={user}><HouseholdPage /></ProtectedRoute>} />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
