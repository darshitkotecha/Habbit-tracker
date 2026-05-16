import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trophy, LayoutDashboard, Users, ShoppingBag, LogOut, Menu, X, Calendar } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { logout, profile } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { name: 'Pitch', path: '/', icon: LayoutDashboard },
    { name: 'Arena', path: '/arena', icon: Users },
    { name: 'Pavilion', path: '/pavilion', icon: ShoppingBag },
    { name: 'Trophies', path: '/trophies', icon: Trophy },
  ];

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-[#FFFFF0] text-[#004D40] font-sans selection:bg-[#004D40] selection:text-[#FFFFF0] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-[#004D40]/10 bg-[#FFFFF0]/90 backdrop-blur-md h-16 flex items-center shrink-0">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsSidebarOpen(true)}
            className="text-[#004D40] hover:bg-[#004D40]/5"
          >
            <Menu size={24} />
          </Button>

          <div className="flex flex-col items-center">
            <h1 className="text-sm font-black italic uppercase tracking-widest leading-none">
              {profile?.name || 'Guest'}
            </h1>
            <div className="flex items-center gap-1 opacity-60 mt-1">
              <Calendar size={10} />
              <span className="text-[10px] font-bold uppercase">{today}</span>
            </div>
          </div>

          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => {
              logout();
              window.location.reload();
            }}
            className="text-red-600 hover:bg-red-50"
          >
            <LogOut size={20} />
          </Button>
        </div>
      </header>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-[#004D40]/40 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-64 bg-[#FFFFF0] border-r border-[#004D40]/10 z-[70] shadow-2xl p-6"
            >
              <div className="flex justify-between items-center mb-10">
                <Link 
                  to="/" 
                  className="flex items-center gap-2 font-bold text-2xl tracking-tighter text-[#004D40]"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <span className="bg-[#004D40] text-[#FFFFF0] px-2 py-0.5 rounded italic">H.Q</span>
                  HABIT QUEST
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                  <X />
                </Button>
              </div>

              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center gap-4 p-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all ${
                        isActive 
                          ? 'bg-[#004D40] text-[#FFFFF0]' 
                          : 'text-[#004D40]/60 hover:bg-[#004D40]/5 hover:text-[#004D40]'
                      }`}
                    >
                      <Icon size={20} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="absolute bottom-6 left-6 right-6">
                <Button 
                  variant="outline" 
                  className="w-full border-red-600 text-red-600 hover:bg-red-50"
                  onClick={() => {
                    logout();
                    window.location.reload();
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="relative z-10 container mx-auto px-4 py-8 flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#004D40]/40 shrink-0">
        Copyright by Darshit K By GDG baroda 2026
      </footer>

      {/* Mobile Quick Nav Bar */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#004D40] text-[#FFFFF0] border border-[#FFFFF0]/10 p-2 rounded-full shadow-2xl w-[90%] max-w-sm">
        <div className="flex items-center justify-around">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link 
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 p-3 rounded-full transition-all duration-300 ${
                  isActive ? 'bg-[#FFFFF0] text-[#004D40] shadow-lg' : 'opacity-60 hover:opacity-100'
                }`}
              >
                <Icon size={20} />
                {isActive && <span className="text-[10px] font-black uppercase tracking-widest px-1 whitespace-nowrap">{item.name}</span>}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
