import { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'motion/react';
import { Users, Swords, Trophy, UserPlus, Shield, MessageSquare, ArrowDown, ArrowUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function Arena() {
  const { profile } = useAuth();
  const [teams, setTeams] = useState<any[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');

  useEffect(() => {
    setTeams(dataService.getTeams());
  }, []);

  const createTeam = () => {
    if (!profile) return;
    alert("Team Created Locally!");
  };

  const inviteMember = async () => {
    // In a real app, this would send an invitation or lookup user by email
    // For this prototype, we'll just show the concept
    setInviteEmail('');
    alert('Invitation sent to ' + inviteEmail);
  };

  return (
    <div className="space-y-8 bg-[#0F172A] -m-4 p-4 md:-m-8 md:p-8 min-h-screen text-white">
      {/* Team Status */}
      {!profile?.teamId ? (
        <Card className="border-2 border-dashed border-white/10 bg-white/[0.03] backdrop-blur-md rounded-[2.5rem]">
          <CardHeader className="text-center pt-12">
            <div className="w-20 h-20 bg-[#32FFC8]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="size-10 text-[#32FFC8]" />
            </div>
            <CardTitle className="text-2xl font-black italic uppercase tracking-widest text-[#32FFC8]">Solo Warrior</CardTitle>
            <CardDescription className="text-white/40 font-medium uppercase tracking-widest text-[10px] mt-2">Cricketers are stronger in a team. Form your Playing XI now.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-12">
            <Button onClick={createTeam} className="bg-[#32FFC8] text-[#0F172A] hover:bg-[#32FFC8]/90 font-black uppercase italic tracking-widest px-8 h-12 rounded-full">
              Form my Playing XI
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="md:col-span-2 bg-[#1E293B] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 bg-white/[0.02] p-8">
              <div>
                <CardTitle className="text-white flex items-center gap-3 font-black underline italic decoration-[#32FFC8] underline-offset-8">
                  <Shield size={24} className="text-[#32FFC8]" /> MY TEAM XI
                </CardTitle>
              </div>
              <Badge className="bg-[#32FFC8]/10 text-[#32FFC8] border-[#32FFC8]/20 font-black italic uppercase tracking-widest text-[10px]">Active Match</Badge>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-10">
                <div className="flex -space-x-3">
                  {[...Array(5)].map((_, i) => (
                    <Avatar key={i} className="border-2 border-[#1E293B] ring-2 ring-[#32FFC8]/20 size-12">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} />
                      <AvatarFallback className="bg-white/5 font-black">M</AvatarFallback>
                    </Avatar>
                  ))}
                  <button className="size-12 rounded-full bg-[#32FFC8] text-[#0F172A] flex items-center justify-center border-2 border-[#1E293B] hover:scale-110 transition-transform">
                    <UserPlus size={18} />
                  </button>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mb-1">Team Score</p>
                  <p className="text-4xl font-black italic text-[#32FFC8] tracking-tighter">1,240 <span className="text-white text-lg">XP</span></p>
                </div>
              </div>

              <div className="bg-[#0F172A] border border-white/5 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-500/10 text-red-400 rounded-2xl flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                    <Swords size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-black italic uppercase tracking-widest text-red-200">vs The Challengers</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-30">Closes in 4h 20m</p>
                  </div>
                </div>
                <div className="flex items-center gap-8 bg-white/5 px-8 py-3 rounded-2xl">
                  <div className="text-center">
                    <p className="text-xl font-black text-[#32FFC8]">842</p>
                    <p className="text-[8px] font-black uppercase tracking-widest opacity-40">US</p>
                  </div>
                  <div className="font-black italic text-2xl text-white/10">:</div>
                  <div className="text-center">
                    <p className="text-xl font-black text-red-400">790</p>
                    <p className="text-[8px] font-black uppercase tracking-widest opacity-40">THEM</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-white/[0.02] p-8 gap-4 border-t border-white/5">
              <Input 
                placeholder="INVITE BY EMAIL..." 
                value={inviteEmail} 
                onChange={e => setInviteEmail(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-12 font-black italic uppercase tracking-widest text-[10px]"
              />
              <Button onClick={inviteMember} size="lg" className="bg-[#32FFC8] text-[#0F172A] hover:bg-[#32FFC8]/90 font-black uppercase italic tracking-widest">Invite</Button>
            </CardFooter>
          </Card>

          <Card className="bg-[#0F172A] border border-white/10 rounded-[2.5rem] shadow-none">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xs font-black italic uppercase tracking-[0.3em] flex items-center gap-3 text-white">
                <Trophy size={16} className="text-[#FFD700]" /> LEADERBOARD
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              {teams.map((t, i) => (
                <div key={t.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-all group">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black opacity-20 group-hover:opacity-100 group-hover:text-[#32FFC8] transition-colors">#{i + 1}</span>
                    <p className="text-xs font-black uppercase italic tracking-wider">{t.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-black italic text-[#32FFC8]">{t.totalScore}</p>
                    <span className="text-[8px] font-black opacity-20">XP</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Global Arena Feed */}
      <section className="pb-24">
        <h2 className="text-xl font-black italic uppercase tracking-widest text-white mb-6 flex items-center gap-3">
          <MessageSquare size={24} className="text-[#00D1FF]" /> Arena Broadcast
        </h2>
        <div className="space-y-4">
          {[
            { user: 'S. Tendulkar', msg: 'Just completed a 5k run! Ascension incoming.', points: '+15', type: 'up' },
            { user: 'V. Kohli', msg: 'Lost a match to Alpha Squad. Back to the nets.', points: '-20', type: 'down' },
          ].map((item, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-6 p-6 bg-white/[0.03] border border-white/5 rounded-[2rem] hover:border-white/10 transition-colors shadow-sm"
            >
              <Avatar className="size-12 ring-2 ring-white/5">
                <AvatarFallback className="bg-white/5 font-black text-[#32FFC8]">{item.user[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-xs font-medium leading-relaxed">
                  <span className="font-black italic uppercase tracking-wider text-white mr-2">{item.user}</span> 
                  <span className="opacity-40">{item.msg}</span>
                </p>
              </div>
              <div className={`flex items-center gap-2 font-black italic text-lg ${item.type === 'up' ? 'text-[#32FFC8]' : 'text-red-400'}`}>
                {item.type === 'up' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                {item.points}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
