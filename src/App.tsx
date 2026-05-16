import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Arena from './pages/Arena';
import Pavilion from './pages/Pavilion';

function AppContent() {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFFF0] flex items-center justify-center">
        <div className="animate-bounce">
          <div className="bg-[#004D40] text-[#FFFFF0] px-4 py-2 rounded-lg italic font-black text-2xl shadow-xl">
            HABIT QUEST
          </div>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          profile ? (
            <Layout>
              <Dashboard />
            </Layout>
          ) : (
            <AuthPage />
          )
        } 
      />
      <Route 
        path="/arena" 
        element={
          profile ? (
            <Layout>
              <Arena />
            </Layout>
          ) : (
            <Navigate to="/" />
          )
        } 
      />
      <Route 
        path="/pavilion" 
        element={
          profile ? (
            <Layout>
              <Pavilion />
            </Layout>
          ) : (
            <Navigate to="/" />
          )
        } 
      />
      <Route 
        path="/trophies" 
        element={
          profile ? (
            <Layout>
              <div className="text-center py-20 italic text-[#004D40]/40">Your Trophy Cabinet is coming soon!</div>
            </Layout>
          ) : (
            <Navigate to="/" />
          )
        } 
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
