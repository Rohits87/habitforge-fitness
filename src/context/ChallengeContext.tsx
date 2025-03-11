
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

type Challenge = {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  type: 'individual' | 'group';
  goal: {
    type: 'workouts' | 'minutes' | 'steps';
    target: number;
  };
  participants: {
    userId: string;
    name: string;
    progress: number;
  }[];
  rewards: {
    xp: number;
    badge?: string;
  };
};

type ChallengeProgress = {
  challengeId: string;
  userId: string;
  progress: number;
  completed: boolean;
  joinedAt: Date;
};

type ChallengeContextType = {
  challenges: Challenge[];
  userChallenges: Challenge[];
  joinChallenge: (challengeId: string) => Promise<void>;
  leaveChallenge: (challengeId: string) => Promise<void>;
  updateProgress: (challengeId: string, progress: number) => Promise<void>;
  isLoading: boolean;
};

// Sample data
const sampleChallenges: Challenge[] = [
  {
    id: 'c1',
    title: '7-Day Consistency',
    description: 'Complete at least one workout every day for a week.',
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    type: 'individual',
    goal: {
      type: 'workouts',
      target: 7,
    },
    participants: [],
    rewards: {
      xp: 200,
      badge: 'consistency-master',
    },
  },
  {
    id: 'c2',
    title: 'Weekend Warrior',
    description: 'Complete 3 high-intensity workouts this weekend.',
    startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    type: 'individual',
    goal: {
      type: 'workouts',
      target: 3,
    },
    participants: [],
    rewards: {
      xp: 150,
      badge: 'weekend-warrior',
    },
  },
  {
    id: 'c3',
    title: 'Team 1000',
    description: 'As a group, complete 1000 minutes of exercise this month.',
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    type: 'group',
    goal: {
      type: 'minutes',
      target: 1000,
    },
    participants: [
      {
        userId: 'u1',
        name: 'Alex Kim',
        progress: 120,
      },
      {
        userId: 'u2',
        name: 'Taylor Smith',
        progress: 95,
      },
    ],
    rewards: {
      xp: 500,
      badge: 'team-player',
    },
  },
];

const ChallengeContext = createContext<ChallengeContextType | undefined>(undefined);

export const ChallengeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>(sampleChallenges);
  const [userChallenges, setUserChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadChallenges = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Add mock user to first challenge
      const updatedChallenges = [...sampleChallenges];
      if (user) {
        const firstChallenge = {...updatedChallenges[0]};
        firstChallenge.participants = [
          ...firstChallenge.participants,
          {
            userId: user.id,
            name: user.name,
            progress: 2, // Already completed 2 workouts
          }
        ];
        updatedChallenges[0] = firstChallenge;
        setUserChallenges([firstChallenge]);
      }
      
      setChallenges(updatedChallenges);
      setIsLoading(false);
    };

    loadChallenges();
  }, [user]);

  const joinChallenge = async (challengeId: string) => {
    if (!user) return;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge) {
      const updatedChallenge = {
        ...challenge,
        participants: [
          ...challenge.participants,
          {
            userId: user.id,
            name: user.name,
            progress: 0,
          }
        ]
      };
      
      setChallenges(prev => 
        prev.map(c => c.id === challengeId ? updatedChallenge : c)
      );
      
      setUserChallenges(prev => [...prev, updatedChallenge]);
    }
    
    setIsLoading(false);
  };

  const leaveChallenge = async (challengeId: string) => {
    if (!user) return;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge) {
      const updatedChallenge = {
        ...challenge,
        participants: challenge.participants.filter(p => p.userId !== user.id)
      };
      
      setChallenges(prev => 
        prev.map(c => c.id === challengeId ? updatedChallenge : c)
      );
      
      setUserChallenges(prev => prev.filter(c => c.id !== challengeId));
    }
    
    setIsLoading(false);
  };

  const updateProgress = async (challengeId: string, progress: number) => {
    if (!user) return;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const updateChallenge = (challenge: Challenge) => {
      return {
        ...challenge,
        participants: challenge.participants.map(p => 
          p.userId === user.id ? { ...p, progress } : p
        )
      };
    };
    
    setChallenges(prev => 
      prev.map(c => c.id === challengeId ? updateChallenge(c) : c)
    );
    
    setUserChallenges(prev => 
      prev.map(c => c.id === challengeId ? updateChallenge(c) : c)
    );
    
    setIsLoading(false);
  };

  return (
    <ChallengeContext.Provider
      value={{
        challenges,
        userChallenges,
        joinChallenge,
        leaveChallenge,
        updateProgress,
        isLoading,
      }}
    >
      {children}
    </ChallengeContext.Provider>
  );
};

export const useChallenge = () => {
  const context = useContext(ChallengeContext);
  if (context === undefined) {
    throw new Error('useChallenge must be used within a ChallengeProvider');
  }
  return context;
};
