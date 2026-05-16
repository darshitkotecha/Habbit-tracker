import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Lightbulb, 
  Download, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle2, 
  ArrowLeft,
  Waves,
  Sunrise,
  ShieldAlert,
  Zap,
  Droplets,
  Moon,
  Dumbbell,
  DollarSign
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas';

const QUOTES = [
  { text: "Your future is created by what you do today, not tomorrow.", author: "Robert Kiyosaki" },
  { text: "Quality is not an act, it is a habit.", author: "Aristotle" },
  { text: "First we make our habits, then our habits make us.", author: "John Dryden" },
  { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
];

const BGPICS = [
  "https://images.unsplash.com/photo-1470252649358-96f3c8024229?auto=format&fit=crop&q=80&w=1000", // Sunrise
  "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=1000", // Ocean
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1000", // Mountains
];

const STRATEGIES: Record<string, any> = {
  water: { 
    suggestion: "Drink a glass of water immediately upon waking.", 
    benefit: "Rehydrates the body and boosts cognitive function.", 
    icon: Droplets,
    color: "#00D1FF"
  },
  exercise: { 
    suggestion: "Complete a 10-minute micro-workout if short on time.", 
    benefit: "Maintains momentum and reduces resistance to starting.", 
    icon: Dumbbell,
    color: "#32FFC8"
  },
  read: { 
    suggestion: "Read just 2 pages before switching off the lights.", 
    benefit: "Lowers stress levels and expands neural pathways.", 
    icon: Lightbulb,
    color: "#A855F7"
  },
  sleep: { 
    suggestion: "No screens 30 minutes before your target bedtime.", 
    benefit: "Improves REM cycle quality and emotional regulation.", 
    icon: Moon,
    color: "#FF7E5F"
  },
  finance: { 
    suggestion: "Manual log any luxury expense as soon as it happens.", 
    benefit: "Creates instant awareness and reduces impulsive spending.", 
    icon: DollarSign,
    color: "#FFD700"
  }
};

const ESSENTIAL_HABITS = [
  { id: 'sleep', name: 'Adequate Sleep', issues: "Chronic fatigue, weakened immune system, metabolic disruption." },
  { id: 'exercise', name: 'Physical Activity', issues: "Muscle atrophy, cardiovascular decline, increased anxiety." },
  { id: 'finance', name: 'Financial Awareness', issues: "Debt accumulation, high stress, lack of future security." }
];

export default function Insights() {
  const { profile } = useAuth();
  const [quote, setQuote] = useState(QUOTES[0]);
  const [bgPic, setBgPic] = useState(BGPICS[0]);
  const quoteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Randomize quote and background on mount
    const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    const randomBg = BGPICS[Math.floor(Math.random() * BGPICS.length)];
    setQuote(randomQuote);
    setBgPic(randomBg);
  }, []);

  const downloadQuote = async () => {
    if (!quoteRef.current) return;
    try {
      const canvas = await html2canvas(quoteRef.current, {
        useCORS: true,
        scale: 2,
      });
      const link = document.createElement('a');
      link.download = `habit-quote-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to download image:', err);
    }
  };

  if (!profile) return null;

  // Logic for Strategy: fetch based on selected habits
  const activeStrategies = profile.selectedHabits
    .filter(hId => STRATEGIES[hId])
    .map(hId => ({ ...STRATEGIES[hId], id: hId }));

  // Logic for Risk analysis: which essential habits are MISSING or low performance
  const missingEssentials = ESSENTIAL_HABITS.filter(h => !profile.selectedHabits.includes(h.id));

  return (
    <div className="min-h-screen bg-[#0F172A] -m-4 p-4 md:-m-8 md:p-8 text-white font-sans selection:bg-[#32FFC8] selection:text-[#0F172A] space-y-12 pb-24">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-widest text-[#32FFC8]">
            Habit Strategy
          </h1>
          <p className="text-sm font-bold opacity-40 uppercase tracking-widest mt-1">
            Analyze. Optimize. Evolve.
          </p>
        </div>
        <Link to="/achievements">
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 gap-2">
            <ArrowLeft size={16} /> Back to Evolution
          </Button>
        </Link>
      </div>

      {/* Quote Section (Motivational) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Morning Fuel</h2>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={downloadQuote}
            className="text-[10px] font-black uppercase tracking-widest gap-2 bg-[#004D40]/5"
          >
            <Download size={14} /> Download Quote
          </Button>
        </div>
        
        <div 
          ref={quoteRef}
          className="relative aspect-video md:aspect-[2.41/1] w-full rounded-[2rem] overflow-hidden group shadow-2xl"
        >
          <img 
            src={bgPic} 
            alt="Motivational Background" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 md:p-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl"
            >
              <h3 className="text-2xl md:text-4xl font-serif italic text-white mb-6 leading-tight">
                "{quote.text}"
              </h3>
              <div className="flex items-center justify-center gap-3">
                <div className="h-px w-8 bg-white/40" />
                <p className="text-[11px] font-black uppercase tracking-[0.4em] text-white/80">
                  {quote.author}
                </p>
                <div className="h-px w-8 bg-white/40" />
              </div>
            </motion.div>
          </div>
          {/* Decorative Corner */}
          <div className="absolute bottom-6 right-8 text-white/20 select-none">
            <h4 className="text-[8px] font-black italic uppercase tracking-widest">Habit Quest Premium</h4>
          </div>
        </div>
      </section>

      {/* Strategy Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="text-[#00D1FF]" />
          <h2 className="text-xl font-black italic uppercase tracking-widest">Where to Focus</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeStrategies.length > 0 ? (
            activeStrategies.map((strat, i) => (
              <motion.div
                key={strat.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="bg-white/[0.03] backdrop-blur-xl border-white/10 hover:border-[#00D1FF]/40 transition-colors h-full">
                  <CardContent className="p-6 flex flex-col gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${strat.color}20`, color: strat.color }}>
                      <strat.icon size={24} />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Suggestion</h4>
                      <p className="text-sm font-bold text-white leading-relaxed">
                        {strat.suggestion}
                      </p>
                    </div>
                    <div className="pt-4 mt-auto border-t border-white/5">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 size={12} className="text-[#32FFC8]" />
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40 text-white">Vital Benefit</span>
                      </div>
                      <p className="text-[11px] font-medium text-white/60 italic">
                        {strat.benefit}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center bg-white/[0.03] rounded-3xl border-2 border-dashed border-white/10">
              <p className="text-sm italic font-bold opacity-30 text-white">Select more habits to see custom strategies.</p>
            </div>
          )}
        </div>
      </section>

      {/* Risk Analysis Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <ShieldAlert className="text-red-500" />
          <h2 className="text-xl font-black italic uppercase tracking-widest">Core Habits Missing</h2>
        </div>

        <div className="grid gap-4">
          {missingEssentials.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
            >
              <Card className="bg-red-500/5 backdrop-blur-md border-red-500/20 border-l-4 border-l-red-500/80">
                <CardContent className="p-6 flex items-start gap-5">
                  <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                    <AlertTriangle className="text-red-400" size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-black uppercase italic tracking-wider text-red-100">
                        {item.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded bg-red-600/40 text-[8px] font-black text-red-100 uppercase tracking-tighter border border-red-500/30">High Risk</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Major Issues</span>
                      </div>
                      <p className="text-xs font-bold text-red-100/60 leading-relaxed italic">
                        {item.issues}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          {missingEssentials.length === 0 && (
            <Card className="bg-green-50 border-green-100">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="text-green-600" size={32} />
                </div>
                <h3 className="text-lg font-black italic uppercase tracking-widest text-green-900 mb-2">Core Foundation Secure</h3>
                <p className="text-sm font-medium text-green-800 opacity-60 italic">Your fundamental habits are either active or being tracked. Stay vigilant.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Decorative Branding */}
      <div className="pt-20 text-center opacity-10 pointer-events-none select-none">
        <h2 className="text-6xl font-black italic uppercase tracking-widest">Strategy</h2>
      </div>
    </div>
  );
}
