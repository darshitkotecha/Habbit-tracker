import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

interface AuthContextType {
  profile: UserProfile | null;
  loading: boolean;
  loginAsGuest: (name: string, age: number, habits: string[]) => void;
  logout: () => void;
  refreshProfile: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = () => {
    const localProfile = dataService.getProfile();
    setProfile(localProfile);
  };

  useEffect(() => {
    refreshProfile();
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

  return (
    <AuthContext.Provider value={{ profile, loading, loginAsGuest, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
