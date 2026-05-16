import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, Star, Zap, Award, Target, Flame, Crown, CheckCircle2, Lock, Heart, Gift, Package, ShoppingBag, CreditCard } from 'lucide-react';
import { dataService } from '../services/dataService';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const TROPHIES = [
  { id: 't1', name: 'Early Bird', description: 'Log "Early Wakeup" for 7 days straight', requirement: 7, habitId: 'wakeup', icon: Zap, color: '#FCD34D' },
  { id: 't2', name: 'Hydration Hero', description: 'Log "Drink Water" for 21 days', requirement: 21, habitId: 'water', icon: Flame, color: '#60A5FA' },
  { id: 't3', name: 'Iron Will', description: 'Log "Exercise" for 90 days', requirement: 90, habitId: 'exercise', icon: Target, color: '#F87171' },
  { id: 't4', name: 'Zen Master', description: 'Log "Do Good" for 10 days', requirement: 10, habitId: 'good', icon: Heart, color: '#F472B6' },
  { id: 't5', name: 'Scholar', description: 'Log "Learn" for 30 days', requirement: 30, habitId: 'learn', icon: Award, color: '#A78BFA' },
];

const REWARDS = [
  { id: 'r1', name: 'Elite Habit Journal', type: 'Physical', cost: 300, icon: ShoppingBag, color: '#32FFC8', description: 'Premium leather-bound daily tracker.' },
  { id: 'r2', name: 'Smart Water Bottle', type: 'Physical', cost: 500, icon: Package, color: '#00D1FF', description: 'Syncs with your hydration goals.' },
  { id: 'r3', name: '$10 Gift Card', type: 'Digital', cost: 1000, icon: CreditCard, color: '#FFD700', description: 'Instant digital voucher for top stores.' },
  { id: 'r4', name: '$25 Gift Card', type: 'Digital', cost: 2500, icon: Gift, color: '#FF7E5F', description: 'Unlock premium digital experiences.' },
];

export default function Trophies() {
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

  const xpProgress = (profile.points % 100);
  const currentLevel = Math.floor(profile.points / 100) + 1;

  return (
    <div className="min-h-screen bg-[#0F172A] -m-4 p-4 md:-m-8 md:p-8 text-white font-sans selection:bg-[#32FFC8] selection:text-[#0F172A] space-y-12">
      {/* XP & Level Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Zap size={200} />
        </div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="px-3 py-1 bg-[#32FFC8] text-[#0F172A] text-[10px] font-black uppercase tracking-widest rounded-full">
                  Level {currentLevel}
                </div>
                <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">Ascension Journey</span>
              </div>
              <h1 className="text-5xl font-black italic uppercase tracking-tighter text-[#32FFC8]">
                {profile.points} <span className="text-white">XP</span>
              </h1>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] mb-1">Rank</p>
              <h2 className="text-2xl font-black italic uppercase text-[#FFD700] tracking-wider">{profile.tier}</h2>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
              <span className="text-white/40">Next Level Milestone</span>
              <span className="text-[#32FFC8]">{xpProgress}/100 XP</span>
            </div>
            <div className="h-4 bg-white/5 rounded-full p-1 border border-white/10 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                className="h-full bg-gradient-to-r from-[#32FFC8] to-[#00D1FF] rounded-full shadow-[0_0_15px_rgba(50,255,200,0.5)]"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Showcase */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="text-[#FFD700]" />
            <h2 className="text-2xl font-black italic uppercase tracking-widest">Trophy Cabinet</h2>
          </div>
          <p className="text-xs font-bold text-white/40 uppercase tracking-widest">
            {TROPHIES.filter(t => (habitStats[t.habitId] || 0) >= t.requirement).length} / {TROPHIES.length} Unlocked
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TROPHIES.map((trophy, index) => {
            const current = habitStats[trophy.habitId] || 0;
            const isUnlocked = current >= trophy.requirement;
            const progress = Math.min(100, (current / trophy.requirement) * 100);
            const Icon = trophy.icon;

            return (
              <motion.div
                key={trophy.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`relative h-full overflow-hidden border-2 transition-all duration-500 bg-white/[0.03] backdrop-blur-xl ${
                  isUnlocked 
                    ? 'border-[#FFD700]/30 shadow-[0_0_30px_rgba(255,215,0,0.1)]' 
                    : 'border-white/5 grayscale opacity-60'
                }`}>
                  {isUnlocked && (
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFD700]/10 blur-3xl rounded-full -mr-12 -mt-12" />
                  )}
                  
                  <CardContent className="p-8 flex flex-col items-center text-center h-full">
                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 relative group ${
                      isUnlocked ? 'bg-[#FFD700]/10 text-[#FFD700]' : 'bg-white/5 text-white/20'
                    }`}>
                      <Icon size={40} className={isUnlocked ? 'animate-pulse' : ''} />
                      {!isUnlocked && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Lock size={16} className="text-white/20" />
                        </div>
                      )}
                    </div>

                    <h3 className={`text-xl font-black uppercase italic tracking-wider mb-2 ${isUnlocked ? 'text-white' : 'text-white/40'}`}>
                      {trophy.name}
                    </h3>
                    <p className="text-[11px] font-medium text-white/40 leading-relaxed mb-8 uppercase tracking-wide">
                      {trophy.description}
                    </p>

                    <div className="mt-auto w-full space-y-3">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                        <span className={isUnlocked ? 'text-[#FFD700]' : 'text-white/20'}>Status</span>
                        <span className={isUnlocked ? 'text-[#32FFC8]' : 'text-white/40'}>
                          {isUnlocked ? 'Mastered' : `${current} / ${trophy.requirement} Days`}
                        </span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          className={`h-full rounded-full ${isUnlocked ? 'bg-[#FFD700]' : 'bg-white/20'}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Rewards Store */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Gift className="text-[#32FFC8]" />
            <h2 className="text-2xl font-black italic uppercase tracking-widest">Rewards Store</h2>
          </div>
          <p className="text-xs font-bold text-white/40 uppercase tracking-widest">
            Redeem Your Ascension XP
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {REWARDS.map((reward, index) => {
            const canAfford = profile.points >= reward.cost;

            return (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (index * 0.05) }}
              >
                <Card className="bg-white/[0.03] backdrop-blur-md border-white/10 h-full flex flex-col relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <reward.icon size={80} />
                  </div>
                  
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4">
                      <span 
                        className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter"
                        style={{ backgroundColor: `${reward.color}20`, color: reward.color, border: `1px solid ${reward.color}40` }}
                      >
                        {reward.type}
                      </span>
                      <span className="text-xs font-black italic text-[#32FFC8]">{reward.cost} XP</span>
                    </div>

                    <h3 className="text-sm font-black uppercase italic tracking-wider mb-2 text-white">
                      {reward.name}
                    </h3>
                    <p className="text-[10px] font-medium text-white/40 leading-relaxed mb-6">
                      {reward.description}
                    </p>

                    <Button 
                      disabled={!canAfford}
                      className={`mt-auto w-full font-black uppercase italic tracking-widest text-[10px] h-9 ${
                        canAfford 
                          ? 'bg-[#32FFC8] text-[#0F172A] hover:bg-[#32FFC8]/90' 
                          : 'bg-white/5 text-white/20'
                      }`}
                      onClick={() => {
                        if (canAfford) {
                          alert(`Redemption Request Sent! Our team will contact you regarding the ${reward.name}.`);
                        }
                      }}
                    >
                      {canAfford ? 'Redeem Now' : 'Insufficient XP'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Ranks Legend */}
      <section className="pt-12 border-t border-white/5">
        <div className="flex flex-col items-center gap-6">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Elite Ascension Tiers</h3>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {[
              { name: 'Initiate', xp: '0+', icon: Star, color: '#94A3B8' },
              { name: 'Habit Builder', xp: '21+', icon: Target, color: '#32FFC8' },
              { name: 'Lifestyle Builder', xp: '90+', icon: Award, color: '#A855F7' },
              { name: 'Identity Builder', xp: '365+', icon: Crown, color: '#FFD700' }
            ].map((tier, i) => (
              <div key={i} className="flex flex-col items-center gap-2 opacity-40 hover:opacity-100 transition-opacity">
                <tier.icon size={20} style={{ color: tier.color }} />
                <p className="text-[10px] font-black uppercase tracking-widest">{tier.name}</p>
                <p className="text-[8px] font-bold opacity-30">{tier.xp} XP</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
