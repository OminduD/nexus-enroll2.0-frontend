import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/ui/Toast';
import { BackendHealthProvider } from './context/BackendHealthContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { DashboardLayout } from './components/layout/DashboardLayout';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { CourseCatalogPage } from './pages/student/CourseCatalogPage';
import { StudentSchedulePage } from './pages/student/StudentSchedulePage';
import { DegreeAuditPage } from './pages/student/DegreeAuditPage';
import { AcademicRecordsPage } from './pages/student/AcademicRecordsPage';
import { NotificationsPage } from './pages/student/NotificationsPage';

// Faculty Pages
import { FacultyDashboard } from './pages/faculty/FacultyDashboard';
import { ClassRosterPage } from './pages/faculty/ClassRosterPage';
import { GradeManagementPage } from './pages/faculty/GradeManagementPage';
import { ChangeRequestsPage } from './pages/faculty/ChangeRequestsPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { CourseAdminPage } from './pages/admin/CourseAdminPage';
import { GradeApprovalsPage } from './pages/admin/GradeApprovalsPage';
import { AdminChangeRequestsPage } from './pages/admin/AdminChangeRequestsPage';
import { UserDirectoryPage } from './pages/admin/UserDirectoryPage';
import { SystemReportsPage } from './pages/admin/SystemReportsPage';
import { NotificationBroadcastPage } from './pages/admin/NotificationBroadcastPage';

// Public Landing Page
import LandingPage from './pages/LandingPage';

// Common & Error Pages
import { AccountPage } from './pages/common/AccountPage';
import { NotFoundPage } from './pages/error/NotFoundPage';
import { ServerDownPage } from './pages/error/ServerDownPage';
import { ForbiddenPage } from './pages/error/ForbiddenPage';
import { ServerErrorPage } from './pages/error/ServerErrorPage';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <BackendHealthProvider>
            <ToastProvider>
              <BrowserRouter>
                <Routes>
                  {/* Public Landing & Auth Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/landing" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />

                  {/* Explicit Error Routes */}
                  <Route path="/404" element={<NotFoundPage />} />
                  <Route path="/403" element={<ForbiddenPage />} />
                  <Route path="/500" element={<ServerErrorPage />} />
                  <Route path="/server-down" element={<ServerDownPage />} />

                  {/* Student Protected Routes */}
                  <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
                    <Route element={<DashboardLayout />}>
                      <Route path="/student" element={<Navigate to="/student/dashboard" replace />} />
                      <Route path="/student/dashboard" element={<StudentDashboard />} />
                      <Route path="/student/courses" element={<CourseCatalogPage />} />
                      <Route path="/student/schedule" element={<StudentSchedulePage />} />
                      <Route path="/student/progress" element={<DegreeAuditPage />} />
                      <Route path="/student/records" element={<AcademicRecordsPage />} />
                      <Route path="/student/notifications" element={<NotificationsPage />} />
                      <Route path="/student/account" element={<AccountPage />} />
                    </Route>
                  </Route>

                  {/* Faculty Protected Routes */}
                  <Route element={<ProtectedRoute allowedRoles={['FACULTY']} />}>
                    <Route element={<DashboardLayout />}>
                      <Route path="/faculty" element={<Navigate to="/faculty/dashboard" replace />} />
                      <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
                      <Route path="/faculty/roster" element={<ClassRosterPage />} />
                      <Route path="/faculty/grades" element={<GradeManagementPage />} />
                      <Route path="/faculty/change-requests" element={<ChangeRequestsPage />} />
                      <Route path="/faculty/notifications" element={<NotificationsPage />} />
                      <Route path="/faculty/account" element={<AccountPage />} />
                    </Route>
                  </Route>

                  {/* Admin Protected Routes */}
                  <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                    <Route element={<DashboardLayout />}>
                      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                      <Route path="/admin/dashboard" element={<AdminDashboard />} />
                      <Route path="/admin/courses" element={<CourseAdminPage />} />
                      <Route path="/admin/grade-approvals" element={<GradeApprovalsPage />} />
                      <Route path="/admin/change-requests" element={<AdminChangeRequestsPage />} />
                      <Route path="/admin/users" element={<UserDirectoryPage />} />
                      <Route path="/admin/reports" element={<SystemReportsPage />} />
                      <Route path="/admin/notifications" element={<NotificationBroadcastPage />} />
                      <Route path="/admin/inbox" element={<NotificationsPage />} />
                      <Route path="/admin/account" element={<AccountPage />} />
                    </Route>
                  </Route>

                  {/* Fallback Catch-All Route for Unknown Paths -> 404 */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </BrowserRouter>
            </ToastProvider>
          </BackendHealthProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};
