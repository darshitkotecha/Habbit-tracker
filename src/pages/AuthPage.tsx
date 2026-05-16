import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Trophy, Target, Droplets, Utensils, Zap, BookOpen, Dumbbell, Moon, Heart } from 'lucide-react';

const HABITS = [
  { id: 'wakeup', name: 'Early Wakeup', icon: Zap, color: 'text-yellow-600' },
  { id: 'water', name: 'Drink Water', icon: Droplets, color: 'text-blue-500' },
  { id: 'diet', name: 'Diet Tracker', icon: Utensils, color: 'text-green-600' },
  { id: 'focussed', name: 'Focused Work', icon: Target, color: 'text-purple-600' },
  { id: 'learn', name: 'New Learning', icon: BookOpen, color: 'text-indigo-600' },
  { id: 'exercise', name: 'Exercise', icon: Dumbbell, color: 'text-red-500' },
  { id: 'sleep', name: 'Sleep Tracker', icon: Moon, color: 'text-slate-700' },
  { id: 'good', name: 'Do Good', icon: Heart, color: 'text-pink-500' },
];

export default function AuthPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { loginAsGuest } = useAuth();
  const [data, setData] = useState({
    name: '',
    age: '',
    selectedHabits: [] as string[],
  });

  const handleHabitToggle = (id: string) => {
    setData(prev => ({
      ...prev,
      selectedHabits: prev.selectedHabits.includes(id) 
        ? prev.selectedHabits.filter(h => h !== id)
        : [...prev.selectedHabits, id]
    }));
  };

  const finishSetup = () => {
    setLoading(true);
    setTimeout(() => {
      loginAsGuest(data.name, parseInt(data.age) || 18, data.selectedHabits);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#FFFFF0] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {step === 1 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-[#004D40] border-2 shadow-[8px_8px_0px_rgba(0,77,64,1)]">
              <CardHeader className="text-center">
                <Trophy className="mx-auto text-[#004D40] size-12 mb-4" />
                <CardTitle className="text-3xl font-black italic text-[#004D40]">HABIT QUEST</CardTitle>
                <CardDescription className="text-[#004D40]/60">Step onto the pitch and start your streak.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button 
                    onClick={() => setStep(2)} 
                    className="w-full bg-[#004D40] text-[#FFFFF0] hover:bg-[#00332C] h-12 text-lg font-bold"
                    disabled={loading}
                  >
                    {loading ? 'Entering Pitch...' : 'Join the Team'}
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="text-center text-xs text-[#004D40]/40">
                Score runs daily. Build a legendary identity.
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="border-[#004D40] border-2 shadow-[8px_8px_0px_rgba(0,77,64,1)]">
              <CardHeader>
                <CardTitle className="text-[#004D40]">Player Profile</CardTitle>
                <CardDescription>Tell us about your player stats.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-bold uppercase text-[#004D40]/60">Name</label>
                  <Input 
                    value={data.name} 
                    onChange={(e) => setData({...data, name: e.target.value})} 
                    className="border-[#004D40]"
                    placeholder="W.G. Grace"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold uppercase text-[#004D40]/60">Age</label>
                  <Input 
                    type="number"
                    value={data.age} 
                    onChange={(e) => setData({...data, age: e.target.value})} 
                    className="border-[#004D40]"
                    placeholder="25"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => setStep(3)} 
                  className="w-full bg-[#004D40] text-[#FFFFF0]"
                  disabled={!data.name}
                >
                  Next In
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="border-[#004D40] border-2 shadow-[8px_8px_0px_rgba(0,77,64,1)]">
              <CardHeader>
                <CardTitle className="text-[#004D40]">Select Your Innings</CardTitle>
                <CardDescription>Which habits are you tracking this season?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {HABITS.map((h) => {
                    const Icon = h.icon;
                    const isSelected = data.selectedHabits.includes(h.id);
                    return (
                      <button
                        key={h.id}
                        onClick={() => handleHabitToggle(h.id)}
                        className={`p-3 rounded-lg border-2 flex flex-col items-center gap-1 transition-all ${
                          isSelected 
                            ? 'bg-[#004D40] border-[#004D40] text-white shadow-inner' 
                            : 'border-[#004D40]/10 hover:border-[#004D40]'
                        }`}
                      >
                        <Icon className={isSelected ? 'text-[#FFFFF0]' : h.color} size={24} />
                        <span className="text-[10px] font-bold uppercase tracking-tight">{h.name}</span>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={finishSetup} 
                  className="w-full bg-[#004D40] text-[#FFFFF0]"
                  disabled={data.selectedHabits.length === 0 || loading}
                >
                  {loading ? 'Preparing Pitch...' : 'Start Season'}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
