import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Zap, CheckCircle2, Trophy, Star, ArrowRight, Lightbulb } from 'lucide-react';
import { dataService } from '../services/dataService';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const STAGES = [
  { id: 1, name: 'Habit Initiate', target: 7, color: '#32FFC8', label: '7D' }, // Mint Green
  { id: 2, name: 'Habit Making', target: 21, color: '#00D1FF', label: '21D' }, // Electric Blue
  { id: 3, name: 'Lifestyle Making', target: 90, color: '#A855F7', label: '90D' }, // Deep Purple
  { id: 4, name: 'Personality Making', target: 365, color: '#FF7E5F', label: '365D' }, // Coral
];

const HABITS_META: Record<string, any> = {
  wakeup: { name: 'Early Wakeup', icon: Zap },
  exercise: { name: 'Exercise', icon: Star },
  diet: { name: 'Health Diet', icon: CheckCircle2 },
  read: { name: 'Reading', icon: Trophy },
  water: { name: 'Hydration', icon: Star },
  sleep: { name: 'Rest', icon: Star },
};

function ProgressRing({ radius, stroke, progress, color, target, current }: any) {
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (Math.min(progress, 1)) * circumference;
  const isMastered = progress >= 1;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative flex items-center justify-center">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          {/* Background Ring */}
          <circle
            stroke="white"
            fill="transparent"
            strokeWidth={stroke}
            strokeOpacity={0.05}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress Ring */}
          <motion.circle
            stroke={color}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            style={{
              filter: isMastered ? `drop-shadow(0 0 4px ${color})` : 'none'
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {isMastered ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-white"
            >
              <CheckCircle2 size={16} style={{ color }} />
            </motion.div>
          ) : (
            <span className="text-[10px] font-black text-white/40">{Math.round(progress * 100)}%</span>
          )}
        </div>
      </div>
      <div className="text-center">
        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{current}/{target}d</p>
      </div>
    </div>
  );
}

export default function Achievements() {
  const { profile } = useAuth();
  const [habitStats, setHabitStats] = useState<Record<string, number>>({});

  useEffect(() => {
    if (profile) {
      const stats: Record<string, number> = {};
      profile.selectedHabits.forEach(hId => {
        stats[hId] = dataService.getHabitStats(hId);
      });
      setHabitStats(stats);
    }
  }, [profile]);

  if (!profile) return null;

  const totalDays = Object.values(habitStats).reduce((acc: number, curr: number) => acc + curr, 0);

  return (
    <div className="min-h-screen bg-[#0F172A] -m-4 p-4 md:-m-8 md:p-8 text-white font-sans selection:bg-[#32FFC8] selection:text-[#0F172A]">
      {/* Header Section: Your Evolution */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-2">
          <div className="flex items-center gap-3">
            <Zap className="text-[#32FFC8]" />
            <h1 className="text-2xl font-black italic uppercase tracking-widest text-[#32FFC8]">Your Evolution</h1>
          </div>
          <Link to="/insights">
            <Button className="bg-[#32FFC8] text-[#0F172A] hover:bg-[#32FFC8]/90 font-black uppercase italic tracking-widest text-xs gap-2">
              <Lightbulb size={16} /> Strategic Analysis
            </Button>
          </Link>
        </div>
        <p className="text-white/40 text-sm font-medium tracking-wide max-w-lg">
          The 4 psychological stages of transformation. From a simple click to absolute mastery of your personality.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardContent className="p-4">
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1">Total Effort</p>
              <p className="text-2xl font-black italic">{totalDays} Days</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardContent className="p-4">
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1">Habits Alive</p>
              <p className="text-2xl font-black italic">{profile.selectedHabits.length}</p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Habits Grid */}
      <div className="grid gap-6">
        {profile.selectedHabits.map((hId, index) => {
          const habit = HABITS_META[hId] || { name: hId, icon: CheckCircle2 };
          const Icon = habit.icon;
          const completedDays = habitStats[hId] || 0;

          return (
            <motion.div
              key={hId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white/[0.03] border-white/10 backdrop-blur-md overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#32FFC8]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <CardContent className="p-6 relative">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    {/* Habit Info */}
                    <div className="flex items-center gap-4 min-w-[200px]">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#32FFC8]">
                        <Icon size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-black uppercase italic tracking-wider leading-none mb-1">
                          {habit.name}
                        </h3>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                          Current Form <ArrowRight size={10} /> {completedDays} Days
                        </p>
                      </div>
                    </div>

                    {/* Progress Rings */}
                    <div className="flex-1 flex justify-between md:justify-end items-center gap-4 md:gap-12">
                      {STAGES.map((stage) => {
                        const progress = completedDays / stage.target;
                        return (
                          <div key={stage.id} className="flex flex-col items-center">
                            <ProgressRing
                              radius={35}
                              stroke={3}
                              progress={progress}
                              color={stage.color}
                              target={stage.target}
                              current={completedDays}
                            />
                            <p 
                              className="text-[8px] font-black uppercase tracking-[0.2em] mt-2 opacity-40 text-center max-w-[60px]"
                              style={{ color: progress >= 1 ? stage.color : 'inherit', opacity: progress >= 1 ? 1 : 0.4 }}
                            >
                              {stage.name.split(' ')[0]}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Legend / Info */}
      <div className="mt-12 p-6 border-t border-white/5">
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-6 text-center">Transformation Legend</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STAGES.map(stage => (
            <div key={stage.id} className="flex flex-col items-center text-center">
              <div className="w-2 h-2 rounded-full mb-3 shadow-[0_0_8px_rgba(255,255,255,0.5)]" style={{ backgroundColor: stage.color }} />
              <p className="text-[10px] font-black uppercase tracking-widest mb-1">{stage.name}</p>
              <p className="text-[8px] font-bold text-white/20 uppercase">{stage.target} Days of focus</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
