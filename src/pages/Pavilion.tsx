import { useAuth } from '../hooks/useAuth';
import { motion } from 'motion/react';
import { Gift, Wallet, CreditCard, ShoppingCart, Star, Zap, Trophy } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const REWARDS = [
  { id: '1', name: 'Premium Bat Skin', cost: 100, type: 'In-Game', color: 'bg-blue-100 text-blue-600', icon: Zap },
  { id: '2', name: '$10 Amazon Gift Card', cost: 500, type: 'Real World', color: 'bg-orange-100 text-orange-600', icon: CreditCard },
  { id: '3', name: 'Identity Coaching Session', cost: 1200, type: 'Real World', color: 'bg-purple-100 text-purple-600', icon: Star },
  { id: '4', name: 'Cricket Kit Voucher', cost: 800, type: 'Discount', color: 'bg-green-100 text-green-600', icon: ShoppingCart },
];

export default function Pavilion() {
  const { profile } = useAuth();

  const handleRedeem = (item: any) => {
    if ((profile?.points || 0) < item.cost) {
      alert("Innings not long enough! Score more runs.");
      return;
    }
    alert(`Redeemed ${item.name}! Check your locker.`);
  };

  return (
    <div className="space-y-8">
      {/* Wallet */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white border-4 border-[#004D40] p-6 rounded-2xl shadow-[8px_8px_0px_rgba(0,77,64,1)] flex items-center justify-between"
      >
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2 text-[#004D40]">
            <Wallet /> PLAYER WALLET
          </h1>
          <p className="text-sm opacity-60">Redeem your hard-earned runs for glory.</p>
        </div>
        <div className="text-right">
          <p className="text-4xl font-black italic text-[#004D40]">{profile?.points || 0} Runs</p>
        </div>
      </motion.div>

      {/* Rewards Grid */}
      <section>
        <h2 className="text-xl font-black italic uppercase tracking-tighter text-[#004D40] mb-4 flex items-center gap-2">
          <Gift /> Exclusive Trophies
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {REWARDS.map((item) => {
            const Icon = item.icon;
            const canAfford = (profile?.points || 0) >= item.cost;
            return (
              <motion.div key={item.id} whileHover={{ y: -5 }}>
                <Card className="h-full border-2 border-[#004D40]/10 hover:border-[#004D40] transition-colors overflow-hidden">
                  <div className={`h-32 flex items-center justify-center ${item.id === '1' ? 'bg-[#004D40]/10' : 'bg-[#004D40]/5'}`}>
                    <Icon size={48} className="text-[#004D40]/40" />
                  </div>
                  <CardHeader className="pb-2">
                    <Badge className={`w-fit mb-2 border-none ${item.color}`}>{item.type}</Badge>
                    <CardTitle className="text-lg leading-tight">{item.name}</CardTitle>
                    <CardDescription className="font-bold text-[#004D40] italic pt-1">{item.cost} Runs</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button 
                      onClick={() => handleRedeem(item)} 
                      disabled={!canAfford}
                      className={`w-full font-bold ${canAfford ? 'bg-[#004D40] text-white hover:bg-[#00332C]' : 'bg-[#004D40]/5 text-[#004D40]/30'}`}
                    >
                      {canAfford ? 'Claim Reward' : 'Need More Runs'}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Badges / Locker */}
      <section>
        <h2 className="text-xl font-black italic uppercase tracking-tighter text-[#004D40] mb-4 flex items-center gap-2">
          <Trophy /> Your Locker
        </h2>
        <div className="bg-[#004D40]/5 p-8 rounded-2xl border-2 border-dashed border-[#004D40]/20 text-center">
          <p className="text-sm opacity-40 font-bold italic uppercase tracking-widest">Locker is empty. Buy something!</p>
        </div>
      </section>
    </div>
  );
}
