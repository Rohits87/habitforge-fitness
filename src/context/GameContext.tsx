
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

type AchievementType = 'streak' | 'workouts' | 'challenge' | 'level';

type Achievement = {
  id: string;
  title: string;
  description: string;
  type: AchievementType;
  requirement: number;
  image?: string;
  unlockedAt?: Date;
  progress: number;
};

type UserGameStats = {
  level: number;
  xp: number;
  xpToNextLevel: number;
  streak: number;
  totalWorkouts: number;
  minutesExercised: number;
  achievements: Achievement[];
};

type GameContextType = {
  stats: UserGameStats;
  achievements: Achievement[];
  addXP: (amount: number) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  incrementWorkouts: (count?: number) => void;
  addMinutes: (minutes: number) => void;
  isLoading: boolean;
};

// Initial achievements
const initialAchievements: Achievement[] = [
  {
    id: 'a1',
    title: 'First Steps',
    description: 'Complete your first workout',
    type: 'workouts',
    requirement: 1,
    progress: 0,
  },
  {
    id: 'a2',
    title: 'Consistency Champion',
    description: 'Maintain a 7-day streak',
    type: 'streak',
    requirement: 7,
    progress: 0,
  },
  {
    id: 'a3',
    title: 'Challenge Accepted',
    description: 'Complete your first challenge',
    type: 'challenge',
    requirement: 1,
    progress: 0,
  },
  {
    id: 'a4',
    title: 'Level 5 Fitness',
    description: 'Reach level 5',
    type: 'level',
    requirement: 5,
    progress: 1,
  },
  {
    id: 'a5',
    title: 'Workout Warrior',
    description: 'Complete 10 workouts',
    type: 'workouts',
    requirement: 10,
    progress: 0,
  },
];

// XP required for each level
const levelXPRequirements = [0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200];

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<UserGameStats>({
    level: 1,
    xp: 0,
    xpToNextLevel: levelXPRequirements[1],
    streak: 0,
    totalWorkouts: 0,
    minutesExercised: 0,
    achievements: [],
  });
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);

  useEffect(() => {
    const loadGameData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Set mock data for logged in user
      const mockStats: UserGameStats = {
        level: 2,
        xp: 150,
        xpToNextLevel: levelXPRequirements[2],
        streak: 3,
        totalWorkouts: 5,
        minutesExercised: 120,
        achievements: [],
      };
      
      // Update achievement progress
      const updatedAchievements = initialAchievements.map(achievement => {
        let progress = 0;
        
        switch (achievement.type) {
          case 'workouts':
            progress = mockStats.totalWorkouts;
            break;
          case 'streak':
            progress = mockStats.streak;
            break;
          case 'level':
            progress = mockStats.level;
            break;
          default:
            progress = 0;
        }
        
        const unlocked = progress >= achievement.requirement;
        
        return {
          ...achievement,
          progress,
          unlockedAt: unlocked ? new Date(Date.now() - 86400000) : undefined,
        };
      });
      
      // Set first achievement as unlocked
      updatedAchievements[0].unlockedAt = new Date(Date.now() - 2 * 86400000);
      
      setAchievements(updatedAchievements);
      mockStats.achievements = updatedAchievements.filter(a => a.unlockedAt);
      setStats(mockStats);
      
      setIsLoading(false);
    };
    
    loadGameData();
  }, [user]);

  // Check for newly earned achievements
  const checkAchievements = (newStats: UserGameStats) => {
    const updatedAchievements = achievements.map(achievement => {
      if (achievement.unlockedAt) return achievement;
      
      let progress = 0;
      switch (achievement.type) {
        case 'workouts':
          progress = newStats.totalWorkouts;
          break;
        case 'streak':
          progress = newStats.streak;
          break;
        case 'level':
          progress = newStats.level;
          break;
        case 'challenge':
          // Challenges would be tracked elsewhere
          progress = achievement.progress;
          break;
      }
      
      const newUnlocked = progress >= achievement.requirement;
      
      return {
        ...achievement,
        progress,
        unlockedAt: newUnlocked ? new Date() : undefined,
      };
    });
    
    setAchievements(updatedAchievements);
    return updatedAchievements.filter(a => a.unlockedAt && 
      !newStats.achievements.some(sa => sa.id === a.id));
  };

  // Calculate level based on XP
  const calculateLevel = (xp: number) => {
    let level = 1;
    while (level < levelXPRequirements.length && xp >= levelXPRequirements[level]) {
      level++;
    }
    return level;
  };

  // Add XP
  const addXP = (amount: number) => {
    setStats(prev => {
      const newXP = prev.xp + amount;
      const newLevel = calculateLevel(newXP);
      const newXPToNextLevel = newLevel < levelXPRequirements.length 
        ? levelXPRequirements[newLevel] 
        : prev.xpToNextLevel + 1000;
      
      const newStats = {
        ...prev,
        xp: newXP,
        level: newLevel,
        xpToNextLevel: newXPToNextLevel,
      };
      
      // Check for newly unlocked achievements
      const newAchievements = checkAchievements(newStats);
      
      return {
        ...newStats,
        achievements: [...prev.achievements, ...newAchievements],
      };
    });
  };

  // Increment streak
  const incrementStreak = () => {
    setStats(prev => {
      const newStats = {
        ...prev,
        streak: prev.streak + 1,
      };
      
      const newAchievements = checkAchievements(newStats);
      
      return {
        ...newStats,
        achievements: [...prev.achievements, ...newAchievements],
      };
    });
  };

  // Reset streak
  const resetStreak = () => {
    setStats(prev => ({
      ...prev,
      streak: 0,
    }));
  };

  // Increment workouts
  const incrementWorkouts = (count = 1) => {
    setStats(prev => {
      const newStats = {
        ...prev,
        totalWorkouts: prev.totalWorkouts + count,
      };
      
      const newAchievements = checkAchievements(newStats);
      
      return {
        ...newStats,
        achievements: [...prev.achievements, ...newAchievements],
      };
    });
  };

  // Add minutes exercised
  const addMinutes = (minutes: number) => {
    setStats(prev => ({
      ...prev,
      minutesExercised: prev.minutesExercised + minutes,
    }));
  };

  return (
    <GameContext.Provider
      value={{
        stats,
        achievements,
        addXP,
        incrementStreak,
        resetStreak,
        incrementWorkouts,
        addMinutes,
        isLoading,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
