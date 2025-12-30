import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Toaster } from './components/ui/sonner';

// Auth screens
import { LandingPage } from './screens/LandingPage';
import { SignUpPage } from './screens/SignUpPage';
import { LoginPage } from './screens/LoginPage';
import { EmailVerificationPage } from './screens/EmailVerificationPage';
import { ForgotPasswordPage } from './screens/ForgotPasswordPage';
import { OnboardingPage } from './screens/OnboardingPage';
import { AccountSettingsPage } from './screens/AccountSettingsPage';

// App screens
import { ProjectsDashboard } from './screens/ProjectsDashboard';
import { ProjectWorkspace } from './screens/ProjectWorkspace';
import { Dashboard } from './screens/Dashboard';
import { ReadingInterface } from './screens/ReadingInterface';
import { EnhancedReadingInterface } from './screens/EnhancedReadingInterface';
import { ReadingQueueScreen } from './screens/ReadingQueueScreen';
import { GraphView } from './screens/GraphView';
import { ExportView } from './screens/ExportView';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/email-verification" element={<EmailVerificationPage />} />

          {/* Protected routes */}
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <OnboardingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <AccountSettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <ProjectsDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/project/:id"
            element={
              <ProtectedRoute>
                <ProjectWorkspace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/project/:projectId/read/:paperId"
            element={
              <ProtectedRoute>
                <EnhancedReadingInterface />
              </ProtectedRoute>
            }
          />
          <Route
            path="/project/:projectId/queue"
            element={
              <ProtectedRoute>
                <ReadingQueueScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/project/:projectId/graph/:paperId"
            element={
              <ProtectedRoute>
                <GraphView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/papers"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reader/:id"
            element={
              <ProtectedRoute>
                <ReadingInterface />
              </ProtectedRoute>
            }
          />
          <Route
            path="/graph/:id"
            element={
              <ProtectedRoute>
                <GraphView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/export/:id"
            element={
              <ProtectedRoute>
                <ExportView />
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  );
}