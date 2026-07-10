import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LayoutProvider, useLayout } from './contexts/LayoutContext';

// --- Layout Components ---
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import MobileSidebar from './components/Layout/MobileSidebar';

// --- Page Components ---
import Home from './pages/Home';
import Popular from './pages/Popular';
import Unanswered from './pages/Unanswered';
import Tags from './pages/Tags';
import Users from './pages/Users';
import AskQuestion from './pages/AskQuestion';
import QuestionDetail from './pages/QuestionDetail';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// This is a standard pattern to allow the main content to access the LayoutContext
const AppContent: React.FC = () => {
  const { isDesktopSidebarOpen } = useLayout();

  return (
    // This div contains the sidebar and the main content area side-by-side
    <div className="flex pt-16">
      <Sidebar />
      {/* This main content area correctly adjusts its margin when the sidebar collapses */}
      <main className={`flex-1 transition-all duration-300 ease-in-out ${isDesktopSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
        <div className="p-4 md:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/popular" element={<Popular />} />
            <Route path="/unanswered" element={<Unanswered />} />
            <Route path="/tags" element={<Tags />} />
            <Route path="/users" element={<Users />} />
            <Route path="/ask" element={<AskQuestion />} />
            <Route path="/questions/:id" element={<QuestionDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

// This is the main root component of your application
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          {/* LayoutProvider makes the sidebar state available to all children */}
          <LayoutProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
              <Header />
              <MobileSidebar />
              <AppContent />
            </div>
          </LayoutProvider>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;