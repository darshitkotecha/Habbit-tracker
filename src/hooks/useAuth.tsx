import { useAuthContext } from '../contexts/AuthContext';

export type { UserProfile } from '../contexts/AuthContext';

export function useAuth() {
  const { profile, loading, loginAsGuest, logout, refreshProfile } = useAuthContext();
  
  return { 
    user: profile, 
    profile, 
    loading, 
    loginAsGuest, 
    logout,
    refreshProfile
  };
}
