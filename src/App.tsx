import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Suspense, lazy } from 'react';
import Header from './components/Header';
import './App.css';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Study = lazy(() => import('./pages/Study'));
const Quiz = lazy(() => import('./pages/Quiz'));
const Learn = lazy(() => import('./pages/Learn'));
const Statistics = lazy(() => import('./pages/Statistics'));
const Settings = lazy(() => import('./pages/Settings'));

// Loading component for lazy-loaded pages
const PageLoader: React.FC = () => (
  <div className="page-loader">
    <div className="loader-content">
      <div className="tropical-icon">🌴</div>
      <p>Loading your Portuguese learning adventure...</p>
      <div className="loading-spinner"></div>
    </div>
  </div>
);

// Page transition wrapper component
const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
};

// Main app content with page transitions
const AppContent: React.FC = () => {
  const location = useLocation();

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Suspense fallback={<PageLoader />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={
                <PageTransition>
                  <Home />
                </PageTransition>
              } />
              <Route path="/study" element={
                <PageTransition>
                  <Study />
                </PageTransition>
              } />
              <Route path="/quiz" element={
                <PageTransition>
                  <Quiz />
                </PageTransition>
              } />
              <Route path="/learn" element={
                <PageTransition>
                  <Learn />
                </PageTransition>
              } />
              <Route path="/statistics" element={
                <PageTransition>
                  <Statistics />
                </PageTransition>
              } />
              <Route path="/settings" element={
                <PageTransition>
                  <Settings />
                </PageTransition>
              } />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App
