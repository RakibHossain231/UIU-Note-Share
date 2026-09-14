import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { analytics } from './services/analyticsService';
import { HomePage } from './pages/HomePage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { ContributorsPage } from './pages/ContributorsPage';
import { AboutPage } from './pages/AboutPage';
import { AdminDashboard } from './pages/AdminDashboard';

const AnalyticsTracker: React.FC = () => {
  const location = useLocation();
  useEffect(() => {
    analytics.trackPageView(location.pathname + location.search);
  }, [location]);
  return null;
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <DataProvider>
        <BrowserRouter>
          <AnalyticsTracker />
          <ScrollToTop />
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/course/:courseId" element={<CourseDetailPage />} />
                <Route path="/contributors" element={<ContributorsPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </DataProvider>
    </ThemeProvider>
  );
};

export default App;
