import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Arena from './pages/Arena';
import Pavilion from './pages/Pavilion';

export default function App() {
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

  if (!profile) {
    return <AuthPage />;
  }

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/arena" element={<Arena />} />
          <Route path="/pavilion" element={<Pavilion />} />
          <Route path="/trophies" element={<div className="text-center py-20 italic text-[#004D40]/40">Your Trophy Cabinet is coming soon!</div>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
