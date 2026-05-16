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
    <div className="space-y-8">
      {/* Team Status */}
      {!profile?.teamId ? (
        <Card className="border-2 border-dashed border-[#004D40]/30 bg-[#004D40]/5">
          <CardHeader className="text-center">
            <Users className="mx-auto size-12 text-[#004D40] opacity-40 mb-2" />
            <CardTitle className="text-[#004D40]">No Team Yet</CardTitle>
            <CardDescription>Cricketers are stronger in a team. Form yours now.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={createTeam} className="bg-[#004D40] text-white">Form my Playing XI</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 border-2 border-[#004D40] shadow-[4px_4px_0px_rgba(0,77,64,1)]">
            <CardHeader className="flex flex-row items-center justify-between border-b bg-[#004D40]/5">
              <div>
                <CardTitle className="text-[#004D40] flex items-center gap-2 italic">
                  <Shield size={20} /> MY TEAM XI
                </CardTitle>
              </div>
              <Badge variant="outline" className="border-[#004D40] text-[#004D40]">Active Match</Badge>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex -space-x-3">
                  {[...Array(4)].map((_, i) => (
                    <Avatar key={i} className="border-2 border-white ring-2 ring-[#004D40]/10">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} />
                      <AvatarFallback>M</AvatarFallback>
                    </Avatar>
                  ))}
                  <button className="size-10 rounded-full bg-[#004D40] text-white flex items-center justify-center border-2 border-white">
                    <UserPlus size={16} />
                  </button>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase opacity-60">Team Score</p>
                  <p className="text-3xl font-black italic text-[#004D40]">1,240 Runs</p>
                </div>
              </div>

              <div className="bg-[#FFFFF0] border-2 border-[#004D40]/10 p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 text-red-600 rounded-lg"><Swords size={20} /></div>
                  <div>
                    <p className="text-sm font-bold">vs The Challengers</p>
                    <p className="text-[10px] uppercase opacity-60">Closes in 4h 20m</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-xs font-bold">842</p>
                    <p className="text-[8px] uppercase">Us</p>
                  </div>
                  <div className="font-black italic">:</div>
                  <div className="text-center">
                    <p className="text-xs font-bold">790</p>
                    <p className="text-[8px] uppercase">Them</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-[#004D40]/5 gap-2">
              <Input 
                placeholder="Invite by email..." 
                value={inviteEmail} 
                onChange={e => setInviteEmail(e.target.value)}
                className="bg-white border-[#004D40]/20"
              />
              <Button onClick={inviteMember} size="sm" className="bg-[#004D40] text-white">Invite</Button>
            </CardFooter>
          </Card>

          <Card className="border-2 border-[#004D40]/10 shadow-none">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                <Trophy size={16} /> LEADERBOARD
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {teams.map((t, i) => (
                <div key={t.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-[#004D40]/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black opacity-30">#{i + 1}</span>
                    <p className="text-sm font-bold">{t.name}</p>
                  </div>
                  <p className="text-xs font-black italic">{t.totalScore} R</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Global Arena Feed */}
      <section>
        <h2 className="text-xl font-black italic uppercase tracking-tighter text-[#004D40] mb-4 flex items-center gap-2">
          <MessageSquare size={20} /> Match Feed
        </h2>
        <div className="space-y-3">
          {[
            { user: 'S. Tendulkar', msg: 'Just completed a 5k run! Getting those points.', points: '+15', type: 'up' },
            { user: 'V. Kohli', msg: 'Lost a match to Alpha Squad. Points deducted.', points: '-20', type: 'down' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-3 bg-white border-2 border-[#004D40]/5 rounded-xl shadow-sm">
              <Avatar className="size-8">
                <AvatarFallback>{item.user[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-xs"><span className="font-bold">{item.user}</span> {item.msg}</p>
              </div>
              <div className={`flex items-center gap-1 font-black italic text-sm ${item.type === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {item.type === 'up' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                {item.points}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
