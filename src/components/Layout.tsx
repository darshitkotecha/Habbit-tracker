import { ReactNode, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trophy, LayoutDashboard, Users, ShoppingBag, LogOut, Menu, X, Calendar, Zap, Lightbulb } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useDate } from '../contexts/DateContext';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { logout, profile } = useAuth();
  const { selectedDate, setSelectedDate } = useDate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const navItems = [
    { name: 'Pitch', path: '/', icon: LayoutDashboard },
    { name: 'Evolution', path: '/achievements', icon: Zap },
    { name: 'Strategy', path: '/insights', icon: Lightbulb },
    { name: 'Arena', path: '/arena', icon: Users },
    { name: 'Trophies', path: '/trophies', icon: Trophy },
  ];

  const displayDate = (() => {
    if (!selectedDate) return 'Select Date';
    try {
      const [year, month, day] = selectedDate.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) {
      return selectedDate;
    }
  })();

  const handleDateClick = () => {
    if (dateInputRef.current) {
      if (typeof (dateInputRef.current as any).showPicker === 'function') {
        try {
          (dateInputRef.current as any).showPicker();
        } catch (e) {
          dateInputRef.current.focus();
        }
      } else {
        dateInputRef.current.focus();
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white font-sans selection:bg-[#32FFC8] selection:text-[#0F172A] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0F172A]/80 backdrop-blur-md h-16 flex items-center shrink-0">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsSidebarOpen(true)}
            className="text-white hover:bg-white/5"
          >
            <Menu size={24} />
          </Button>
 
          <div className="flex flex-col items-center">
            <h1 className="text-[10px] font-black italic uppercase tracking-widest leading-none opacity-40 mb-1">
              {profile?.name || 'Guest'}
            </h1>
            <div 
              onClick={handleDateClick}
              className="flex items-center gap-1 hover:text-[#32FFC8] transition-colors relative cursor-pointer px-2"
            >
              <Calendar size={10} className="text-[#32FFC8]" />
              <span className="text-[10px] font-black uppercase tracking-widest">{displayDate}</span>
              <input 
                type="date"
                ref={dateInputRef}
                className="absolute inset-0 opacity-0 pointer-events-none"
                value={selectedDate}
                onChange={(e) => {
                  if (e.target.value) {
                    setSelectedDate(e.target.value);
                  }
                }}
              />
            </div>
          </div>

          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => {
              logout();
              window.location.reload();
            }}
            className="text-white/40 hover:text-red-400 hover:bg-red-500/10"
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
              className="fixed top-0 left-0 bottom-0 w-64 bg-[#0F172A] border-r border-white/10 z-[70] shadow-2xl p-6"
            >
              <div className="flex justify-between items-center mb-10">
                <Link 
                  to="/" 
                  className="flex items-center gap-2 font-black text-2xl tracking-tighter text-white italic"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <span className="bg-[#32FFC8] text-[#0F172A] px-2 py-0.5 rounded not-italic">H.Q</span>
                  QUEST
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)} className="text-white hover:bg-white/5">
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
                      className={`flex items-center gap-4 p-4 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] transition-all ${
                        isActive 
                          ? 'bg-[#32FFC8] text-[#0F172A] shadow-[0_0_20px_rgba(50,255,200,0.3)]' 
                          : 'text-white/40 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon size={18} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="absolute bottom-6 left-6 right-6">
                <Button 
                  variant="outline" 
                  className="w-full border-white/10 text-white/40 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20"
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
      <footer className="py-8 text-center text-[8px] font-black uppercase tracking-[0.3em] text-white/10 shrink-0">
        Habit Quest Elite Phase &copy; 2026
      </footer>

      {/* Mobile Quick Nav Bar */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#1E293B] text-white border border-white/10 p-2 rounded-full shadow-[0_10px_50px_rgba(0,0,0,0.5)] w-[90%] max-w-sm">
        <div className="flex items-center justify-around">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link 
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 p-3 rounded-full transition-all duration-300 ${
                  isActive ? 'bg-[#32FFC8] text-[#0F172A] shadow-lg shadow-[#32FFC8]/20' : 'opacity-40 hover:opacity-100'
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
