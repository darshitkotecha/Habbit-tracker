import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { dataService } from '../services/dataService';
import { useAuth } from '../hooks/useAuth';
import { useDate } from '../contexts/DateContext';
import Layout from '../components/Layout';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  CheckCircle2, Image as ImageIcon, Trophy, Star, History, Upload,
  Zap, Droplets, Utensils, Target, BookOpen, Dumbbell, Moon, Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const HABIT_ICONS: Record<string, any> = {
  wakeup: { icon: Zap, color: 'text-yellow-600', name: 'Early Wakeup' },
  water: { icon: Droplets, color: 'text-blue-500', name: 'Drink Water' },
  diet: { icon: Utensils, color: 'text-green-600', name: 'Diet' },
  focussed: { icon: Target, color: 'text-purple-600', name: 'Focus' },
  learn: { icon: BookOpen, color: 'text-indigo-600', name: 'Learn' },
  exercise: { icon: Dumbbell, color: 'text-red-500', name: 'Exercise' },
  sleep: { icon: Moon, color: 'text-slate-700', name: 'Sleep' },
  good: { icon: Heart, color: 'text-pink-500', name: 'Do Good' },
};

const TIER_GOALS = {
  'Initiate': 7,
  'Habit Builder': 21,
  'Lifestyle Builder': 90,
  'Identity Builder': 365
};

export default function Dashboard() {
  const { profile } = useAuth();
  const { selectedDate, setSelectedDate } = useDate();
  const [logs, setLogs] = useState<any[]>([]);
  const [todayLogs, setTodayLogs] = useState<Record<string, boolean>>({});
  const [snaps, setSnaps] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [internalPoints, setInternalPoints] = useState(profile?.points || 0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  // Helper to get week dates relative to a specific date
  const getWeekDates = (targetDate: string) => {
    const baseDate = new Date(targetDate.replace(/-/g, '/'));
    const dayOfWeek = baseDate.getDay(); // 0 is Sunday
    const sunday = new Date(baseDate);
    sunday.setDate(baseDate.getDate() - dayOfWeek);
    
    return [...Array(7)].map((_, i) => {
      const date = new Date(sunday);
      date.setDate(sunday.getDate() + i);
      return {
        full: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: date.getDate()
      };
    });
  };

  const weekDates = getWeekDates(selectedDate);

  useEffect(() => {
    if (!profile) return;
    
    const allLogs = dataService.getLogs();
    setLogs(allLogs);
    
    const selectedDayData: Record<string, boolean> = {};
    allLogs.filter(l => l.date === selectedDate).forEach(l => {
      selectedDayData[l.habitId] = l.completed;
    });
    setTodayLogs(selectedDayData);
    setSnaps(dataService.getSnaps(selectedDate));
    setInternalPoints(profile.points);
    setLoading(false);
  }, [profile, selectedDate]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        dataService.saveSnap(selectedDate, base64String);
        setSnaps(prev => [...prev, base64String]);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleHabit = (habitId: string) => {
    if (!profile) return;
    
    const isCompleted = todayLogs[habitId];
    const newStatus = !isCompleted;
    
    const log = {
      habitId,
      date: selectedDate,
      completed: newStatus,
      pointsEarned: newStatus ? 1 : -1,
      timestamp: Date.now()
    };

    dataService.saveLog(log);
    setTodayLogs(prev => ({ ...prev, [habitId]: newStatus }));
    
    const newPoints = internalPoints + (newStatus ? 1 : -1);
    setInternalPoints(newPoints);
    dataService.updatePoints(newPoints);
  };

  if (!profile) return null;

  const currentTierGoal = TIER_GOALS[profile.tier];
  const progressPercent = Math.min(100, (profile.points / currentTierGoal) * 100);

  // Chart data prep
  const chartData = weekDates.map(wd => {
    const dayRuns = logs.filter(l => l.date === wd.full && l.completed).length;
    return {
      day: wd.dayName,
      runs: dayRuns,
      fullDate: wd.full
    };
  });

  const dayScore = logs.filter(l => l.date === selectedDate && l.completed).length;

  return (
    <div className="space-y-8 bg-[#0F172A] -m-4 p-4 md:-m-8 md:p-8 min-h-screen">
      {/* Scoreboard */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-white p-8 rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Trophy size={150} />
        </div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-2">Player Status</p>
              <h1 className="text-4xl font-black italic uppercase tracking-tighter">{profile.name}</h1>
              <div className="flex items-center gap-2 mt-3">
                <Badge className="bg-[#32FFC8] text-[#0F172A] hover:bg-[#32FFC8] border-none font-black italic uppercase tracking-widest text-[10px]">
                  {profile.tier}
                </Badge>
                <Badge variant="outline" className="border-white/10 text-white/40 font-bold px-3">
                  TOTAL XP: {profile.points}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-2">Day Score</p>
              <p className="text-6xl font-black italic text-[#32FFC8] tracking-tighter">{dayScore}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
              <span className="opacity-40">Tier Progress</span>
              <span className="text-[#32FFC8]">{Math.round(progressPercent)}% to {profile.tier === 'Identity Builder' ? 'Legend' : 'Next Tier'}</span>
            </div>
            <div className="h-4 bg-white/5 rounded-full p-1 border border-white/10 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                className="h-full bg-gradient-to-r from-[#32FFC8] to-[#00D1FF] rounded-full shadow-[0_0_15px_rgba(50,255,200,0.5)]"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Week Picker */}
      <section className="bg-white/[0.03] backdrop-blur-md p-4 rounded-[2rem] border border-white/10 shadow-sm overflow-x-auto no-scrollbar">
        <div className="flex justify-between items-center min-w-[400px] px-2">
          {weekDates.map((date) => {
            const isSelected = selectedDate === date.full;
            const isToday = todayStr === date.full;
            return (
              <button
                key={date.full}
                onClick={() => setSelectedDate(date.full)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all min-w-[60px] ${
                  isSelected 
                    ? 'bg-[#32FFC8] text-[#0F172A] shadow-[0_0_20px_rgba(50,255,200,0.3)] scale-110' 
                    : 'hover:bg-white/5 text-white/40'
                }`}
              >
                <span className="text-[10px] font-black uppercase tracking-widest">{date.dayName}</span>
                <span className="text-xl font-black italic leading-none">{date.dayNum}</span>
                {isToday && !isSelected && <div className="w-1.5 h-1.5 bg-[#32FFC8] rounded-full mt-1" />}
              </button>
            )
          })}
        </div>
      </section>

      {/* Today's Innings */}
      <section>
        <h2 className="text-xl font-black italic uppercase tracking-widest text-white mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="text-[#32FFC8]" /> 
            {selectedDate === todayStr ? "Daily Forge" : "Memory Lane"}
          </div>
          <span className="text-[10px] font-black opacity-20 tracking-[0.2em]">{selectedDate}</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {profile.selectedHabits.map((hId) => {
            const h = HABIT_ICONS[hId];
            const Icon = h?.icon || Target;
            const isDone = todayLogs[hId];
            return (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                key={hId}
                onClick={() => toggleHabit(hId)}
                className={`group p-6 rounded-[2rem] border transition-all flex flex-col items-center justify-center gap-4 relative overflow-hidden ${
                  isDone 
                    ? 'bg-gradient-to-br from-[#32FFC8]/20 to-transparent border-[#32FFC8]/40 text-white' 
                    : 'bg-white/[0.03] border-white/5 hover:border-[#32FFC8]/30'
                }`}
              >
                {isDone && (
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    className="absolute top-4 right-4"
                  >
                    <CheckCircle2 size={18} className="text-[#32FFC8]" />
                  </motion.div>
                )}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${isDone ? 'bg-[#32FFC8]/20' : 'bg-white/5'}`}>
                  <Icon size={32} className={isDone ? 'text-[#32FFC8]' : 'text-white/20'} />
                </div>
                <div className="text-center">
                  <p className="text-[8px] font-black uppercase tracking-[0.3em] opacity-40 mb-1">Inning</p>
                  <p className="font-black italic uppercase tracking-wider text-xs leading-tight">{h?.name || hId}</p>
                </div>
              </motion.button>
            )
          })}
        </div>
      </section>

      {/* Stats and Charts */}
      <Tabs defaultValue="weekly" className="w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black italic uppercase tracking-widest text-white flex items-center gap-3">
            <History className="text-[#A855F7]" /> Performance
          </h2>
          <TabsList className="bg-white/5 border-white/10 border p-1 rounded-full">
            <TabsTrigger value="weekly" className="rounded-full px-6 data-[state=active]:bg-[#32FFC8] data-[state=active]:text-[#0F172A] text-[10px] font-black uppercase tracking-widest">Week</TabsTrigger>
            <TabsTrigger value="monthly" className="rounded-full px-6 data-[state=active]:bg-[#32FFC8] data-[state=active]:text-[#0F172A] text-[10px] font-black uppercase tracking-widest">Month</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="weekly">
          <Card className="bg-white/[0.03] backdrop-blur-md border-white/5 overflow-hidden rounded-[2.5rem]">
            <CardContent className="pt-8">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis 
                      dataKey="day" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: '900', fill: 'rgba(255,255,255,0.3)' }} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: '900', fill: 'rgba(255,255,255,0.3)' }} 
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1E293B', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
                      labelStyle={{ fontWeight: '900', textTransform: 'uppercase', color: '#32FFC8', fontSize: '10px', tracking: '0.2em' }}
                      itemStyle={{ fontWeight: 'bold', color: 'white' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="runs" 
                      stroke="#32FFC8" 
                      strokeWidth={4} 
                      dot={{ fill: '#32FFC8', r: 4 }} 
                      activeDot={{ r: 8, fill: '#32FFC8', stroke: '#0F172A', strokeWidth: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Monthly view could be similar with BarChart */}
      </Tabs>

      {/* Photo Streak */}
      <section className="pb-24">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black italic uppercase tracking-widest text-white flex items-center gap-3">
            <ImageIcon size={24} className="text-[#FF7E5F]" /> Evidence Log
          </h2>
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileChange}
          />
          <Button 
            size="sm" 
            variant="outline" 
            className="border-white/10 text-white/40 hover:bg-white/5 hover:text-white rounded-full px-6 font-black uppercase text-[10px] tracking-widest italic"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={14} className="mr-2" /> Upload Evidence
          </Button>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-7 gap-4">
          {[...Array(7)].map((_, i) => {
            const snap = snaps[i];
            return (
              <button 
                key={i} 
                onClick={() => !snap && fileInputRef.current?.click()}
                className="aspect-square bg-white/[0.03] rounded-3xl border-2 border-dashed border-white/5 flex items-center justify-center text-white/10 overflow-hidden group relative transition-all hover:border-[#32FFC8]/30 hover:bg-white/[0.07]"
              >
                {snap ? (
                  <img src={snap} alt={`Snap ${i+1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="flex flex-col items-center gap-1 transition-opacity group-hover:opacity-100 opacity-20">
                    {i === 0 ? <ImageIcon size={24} /> : <div className="text-xs font-black italic">{i+1}</div>}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
