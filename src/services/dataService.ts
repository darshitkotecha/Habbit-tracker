
import { UserProfile } from '../hooks/useAuth';

const STORAGE_KEYS = {
  PROFILE: 'hq_profile',
  LOGS: 'hq_logs',
  TEAMS: 'hq_teams'
};

export const dataService = {
  getProfile: (): UserProfile | null => {
    const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return data ? JSON.parse(data) : null;
  },

  saveProfile: (profile: UserProfile) => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  },

  getLogs: (): any[] => {
    const data = localStorage.getItem(STORAGE_KEYS.LOGS);
    return data ? JSON.parse(data) : [];
  },

  saveLog: (log: any) => {
    const logs = dataService.getLogs();
    const existingIndex = logs.findIndex(l => l.date === log.date && l.habitId === log.habitId);
    
    if (existingIndex > -1) {
      logs[existingIndex] = log;
    } else {
      logs.push(log);
    }
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
  },

  updatePoints: (points: number) => {
    const profile = dataService.getProfile();
    if (profile) {
      profile.points = points;
      // Handle tier progression locally
      if (points >= 365) profile.tier = 'Identity Builder';
      else if (points >= 90) profile.tier = 'Lifestyle Builder';
      else if (points >= 21) profile.tier = 'Habit Builder';
      else profile.tier = 'Initiate';
      
      dataService.saveProfile(profile);
    }
  },

  getTeams: () => {
    const data = localStorage.getItem(STORAGE_KEYS.TEAMS);
    return data ? JSON.parse(data) : [
      { id: '1', name: 'Alpha Squad', totalScore: 1250, members: [] },
      { id: '2', name: 'Boundary Riders', totalScore: 980, members: [] },
      { id: '3', name: 'The Challengers', totalScore: 840, members: [] }
    ];
  }
};
