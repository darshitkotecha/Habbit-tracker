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
    <div className="space-y-8">
      {/* Scoreboard */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#004D40] text-[#FFFFF0] p-6 rounded-2xl border-4 border-[#FFD700]/30 shadow-xl overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Trophy size={100} />
        </div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest opacity-60">Player Status</p>
              <h1 className="text-3xl font-black italic">{profile.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-[#FFD700] text-[#004D40] hover:bg-[#FFD700] border-none font-bold">
                  {profile.tier}
                </Badge>
                <Badge variant="outline" className="border-white/20 text-white/60 font-bold">
                  Total: {profile.points}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold uppercase tracking-widest opacity-60">Day Score</p>
              <p className="text-5xl font-black italic text-[#FFD700]">{dayScore}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
              <span>Tier Progress</span>
              <span>{Math.round(progressPercent)}% to {profile.tier === 'Identity Builder' ? 'Legend' : 'Next Tier'}</span>
            </div>
            <Progress value={progressPercent} className="h-3 bg-[#00332C]" />
          </div>
        </div>
      </motion.div>

      {/* Week Picker */}
      <section className="bg-white p-4 rounded-2xl border-2 border-[#004D40]/5 shadow-sm overflow-x-auto no-scrollbar">
        <div className="flex justify-between items-center min-w-[400px]">
          {weekDates.map((date) => {
            const isSelected = selectedDate === date.full;
            const isToday = todayStr === date.full;
            return (
              <button
                key={date.full}
                onClick={() => setSelectedDate(date.full)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all min-w-[50px] ${
                  isSelected 
                    ? 'bg-[#004D40] text-[#FFFFF0] shadow-lg scale-110' 
                    : 'hover:bg-[#004D40]/5 text-[#004D40]/40'
                }`}
              >
                <span className="text-[10px] font-black uppercase tracking-widest">{date.dayName}</span>
                <span className="text-lg font-black italic leading-none">{date.dayNum}</span>
                {isToday && !isSelected && <div className="w-1 h-1 bg-[#004D40] rounded-full mt-1" />}
              </button>
            )
          })}
        </div>
      </section>

      {/* Today's Innings */}
      <section>
        <h2 className="text-xl font-black italic uppercase tracking-tighter text-[#004D40] mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="fill-current" /> 
            {selectedDate === todayStr ? "Today's Innings" : "Match Day"}
          </div>
          <span className="text-xs font-bold opacity-40">{selectedDate}</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                className={`group p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-3 relative overflow-hidden ${
                  isDone 
                    ? 'bg-[#004D40] border-[#004D40] text-white' 
                    : 'bg-white border-[#004D40]/10 hover:border-[#004D40]'
                }`}
              >
                {isDone && (
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    className="absolute top-2 right-2"
                  >
                    <CheckCircle2 size={16} className="text-[#FFD700]" />
                  </motion.div>
                )}
                <div className={`p-3 rounded-full ${isDone ? 'bg-white/10' : 'bg-[#004D40]/5'}`}>
                  <Icon size={32} className={isDone ? 'text-white' : h?.color} />
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Habit</p>
                  <p className="font-bold text-sm leading-tight">{h?.name || hId}</p>
                </div>
              </motion.button>
            )
          })}
        </div>
      </section>

      {/* Stats and Charts */}
      <Tabs defaultValue="weekly" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black italic uppercase tracking-tighter text-[#004D40] flex items-center gap-2">
            <History /> Match Stats
          </h2>
          <TabsList className="bg-[#004D40]/5 border-[#004D40]/10 border">
            <TabsTrigger value="weekly" className="data-[state=active]:bg-[#004D40] data-[state=active]:text-white">Week</TabsTrigger>
            <TabsTrigger value="monthly" className="data-[state=active]:bg-[#004D40] data-[state=active]:text-white">Month</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="weekly">
          <Card className="border-2 border-[#004D40]/10 shadow-none">
            <CardContent className="pt-6">
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <XAxis 
                      dataKey="day" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 'bold' }} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 'bold' }} 
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      labelStyle={{ fontWeight: 'bold', color: '#004D40' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="runs" 
                      stroke="#004D40" 
                      strokeWidth={4} 
                      dot={{ fill: '#004D40', strokeWidth: 2, r: 4 }} 
                      activeDot={{ r: 8, fill: '#FFD700' }}
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
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black italic uppercase tracking-tighter text-[#004D40] flex items-center gap-2">
            <ImageIcon size={20} /> Daily Snap
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
            className="border-[#004D40] text-[#004D40]"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={14} className="mr-2" /> Upload Snap
          </Button>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
          {[...Array(7)].map((_, i) => {
            const snap = snaps[i];
            return (
              <button 
                key={i} 
                onClick={() => !snap && fileInputRef.current?.click()}
                className="aspect-square bg-[#004D40]/5 rounded-lg border-2 border-dashed border-[#004D40]/20 flex items-center justify-center text-[#004D40]/20 overflow-hidden group relative"
              >
                {snap ? (
                  <img src={snap} alt={`Snap ${i+1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="flex flex-col items-center gap-1 transition-opacity group-hover:opacity-100 opacity-60">
                    {i === 0 ? <ImageIcon size={20} className="text-[#004D40]/40" /> : <div className="text-xs font-bold italic">{i+1}</div>}
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
