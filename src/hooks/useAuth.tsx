import { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';

export interface UserProfile {
  uid: string;
  name: string;
  age: number;
  points: number;
  tier: 'Initiate' | 'Habit Builder' | 'Lifestyle Builder' | 'Identity Builder';
  selectedHabits: string[];
  teamId?: string;
  isGuest?: boolean;
}

export function useAuth() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const localProfile = dataService.getProfile();
    if (localProfile) {
      setProfile(localProfile);
    }
    setLoading(false);
  }, []);

  const loginAsGuest = (name: string, age: number, habits: string[]) => {
    const newProfile: UserProfile = {
      uid: 'guest_' + Math.random().toString(36).substr(2, 9),
      name,
      age,
      points: 0,
      tier: 'Initiate',
      selectedHabits: habits,
      isGuest: true
    };
    dataService.saveProfile(newProfile);
    setProfile(newProfile);
  };

  const logout = () => {
    localStorage.removeItem('hq_profile');
    setProfile(null);
  };

  return { user: profile, profile, loading, loginAsGuest, logout };
}
