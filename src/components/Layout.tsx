import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trophy, LayoutDashboard, Users, ShoppingBag, LogOut } from 'lucide-react';
import { auth } from '../lib/firebase';

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();

  const navItems = [
    { name: 'Pitch', path: '/', icon: LayoutDashboard },
    { name: 'Arena', path: '/arena', icon: Users },
    { name: 'Pavilion', path: '/pavilion', icon: ShoppingBag },
    { name: 'Trophies', path: '/trophies', icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-[#FFFFF0] text-[#004D40] font-sans selection:bg-[#004D40] selection:text-[#FFFFF0]">
      <header className="sticky top-0 z-40 w-full border-b border-[#004D40]/10 bg-[#FFFFF0]/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-2xl tracking-tighter text-[#004D40]">
            <span className="bg-[#004D40] text-[#FFFFF0] px-2 py-0.5 rounded italic">H.Q</span>
            HABIT QUEST
          </Link>
          <button 
            onClick={() => {
              localStorage.removeItem('hq_profile');
              window.location.reload();
            }}
            className="p-2 hover:bg-[#004D40]/5 rounded-full transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 pb-32 md:pb-8">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#004D40] text-[#FFFFF0] border-t border-[#FFFFF0]/10 md:relative md:bg-transparent md:text-inherit md:border-t-0 p-2 md:p-0">
        <div className="container mx-auto flex md:hidden items-center justify-around py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 transition-all ${isActive ? 'scale-110 text-white' : 'opacity-60 hover:opacity-100'}`}
              >
                <Icon size={24} />
                <span className="text-[10px] font-bold uppercase tracking-widest">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
