import { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';
import { useAuth } from '../hooks/useAuth';
import Layout from '../components/Layout';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  CheckCircle2, Camera, Trophy, Star, History, 
  Zap, Droplets, Utensils, Target, BookOpen, Dumbbell, Moon, Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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
  const [logs, setLogs] = useState<any[]>([]);
  const [todayLogs, setTodayLogs] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [internalPoints, setInternalPoints] = useState(profile?.points || 0);

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!profile) return;
    
    const allLogs = dataService.getLogs();
    setLogs(allLogs);
    
    const todayData: Record<string, boolean> = {};
    allLogs.filter(l => l.date === todayStr).forEach(l => {
      todayData[l.habitId] = l.completed;
    });
    setTodayLogs(todayData);
    setInternalPoints(profile.points);
    setLoading(false);
  }, [profile]);

  const toggleHabit = (habitId: string) => {
    if (!profile) return;
    
    const isCompleted = todayLogs[habitId];
    const newStatus = !isCompleted;
    
    const log = {
      habitId,
      date: todayStr,
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
  const chartData = [
    { day: 'Mon', runs: 4 },
    { day: 'Tue', runs: 3 },
    { day: 'Wed', runs: 5 },
    { day: 'Thu', runs: 2 },
    { day: 'Fri', runs: 6 },
    { day: 'Sat', runs: 4 },
    { day: 'Sun', runs: 5 },
  ]; // Mock for now, would aggregate from `logs`

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
              <Badge className="bg-[#FFD700] text-[#004D40] hover:bg-[#FFD700] border-none font-bold mt-1">
                {profile.tier}
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold uppercase tracking-widest opacity-60">Total Runs</p>
              <p className="text-5xl font-black italic text-[#FFD700]">{profile.points}</p>
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

      {/* Today's Innings */}
      <section>
        <h2 className="text-xl font-black italic uppercase tracking-tighter text-[#004D40] mb-4 flex items-center gap-2">
          <Star className="fill-current" /> Today's Innings
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
            <Camera /> Daily Snap
          </h2>
          <Button size="sm" variant="outline" className="border-[#004D40] text-[#004D40]">
            Update Log
          </Button>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="aspect-square bg-[#004D40]/5 rounded-lg border-2 border-dashed border-[#004D40]/20 flex items-center justify-center text-[#004D40]/20">
              {i === 0 ? <Camera size={20} className="text-[#004D40]/40" /> : <div className="text-xs font-bold italic">{i+1}</div>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
