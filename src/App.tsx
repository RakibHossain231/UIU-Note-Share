import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { analytics } from './services/analyticsService';
import { HomePage } from './pages/HomePage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { ContributorsPage } from './pages/ContributorsPage';
import { HowToUsePage } from './pages/HowToUsePage';
import { AboutPage } from './pages/AboutPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { SavedPage } from './pages/SavedPage';

const AnalyticsTracker: React.FC = () => {
  const location = useLocation();
  useEffect(() => {
    analytics.trackPageView(location.pathname + location.search);
  }, [location]);
  return null;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
    <ThemeProvider>
      <ToastProvider>
      <DataProvider>
          <AnalyticsTracker />
          <ScrollToTop />
          <MotionConfig reducedMotion="user">
          <div className="min-h-screen lg:pl-64">
            <Navbar />
            <div className="flex min-h-screen flex-col">
            <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 pt-6 lg:pt-10">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/course/:courseId" element={<CourseDetailPage />} />
                <Route path="/contributors" element={<ContributorsPage />} />
                <Route path="/how-to-use" element={<HowToUsePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/saved" element={<SavedPage />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <div className="pb-16 lg:pb-0"><Footer /></div>
            </div>
          </div>
          </MotionConfig>
      </DataProvider>
      </ToastProvider>
    </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
