
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

type WorkoutLevel = 'beginner' | 'intermediate' | 'advanced';

type Workout = {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  intensity: 'low' | 'medium' | 'high';
  exercises: Exercise[];
  level: WorkoutLevel;
  category: string;
  imageUrl?: string;
};

type Exercise = {
  id: string;
  name: string;
  sets?: number;
  reps?: number;
  duration?: number; // in seconds
  description: string;
  imageUrl?: string;
};

type WorkoutHistory = {
  id: string;
  workoutId: string;
  userId: string;
  date: Date;
  completed: boolean;
  duration: number; // actual duration in minutes
  feedback?: {
    difficulty: 1 | 2 | 3 | 4 | 5;
    enjoyment: 1 | 2 | 3 | 4 | 5;
    comment?: string;
  };
};

type WorkoutContextType = {
  workouts: Workout[];
  recommendedWorkouts: Workout[];
  workoutHistory: WorkoutHistory[];
  isLoading: boolean;
  currentWorkout: Workout | null;
  startWorkout: (workoutId: string) => void;
  completeWorkout: (feedback: WorkoutHistory['feedback']) => void;
  cancelWorkout: () => void;
};

// Sample data - in a real app, this would come from your backend
const sampleWorkouts: Workout[] = [
  {
    id: '1',
    title: 'Morning Bodyweight Routine',
    description: 'Start your day with this energizing bodyweight workout.',
    duration: 20,
    intensity: 'medium',
    level: 'beginner',
    category: 'Bodyweight',
    exercises: [
      {
        id: 'e1',
        name: 'Jumping Jacks',
        duration: 60,
        description: 'Stand with your feet together and arms at your sides, then jump while raising your arms and spreading your legs.',
      },
      {
        id: 'e2',
        name: 'Push-ups',
        sets: 3,
        reps: 10,
        description: 'Start in a plank position, lower your body until your chest nearly touches the floor, then push back up.',
      },
      {
        id: 'e3',
        name: 'Bodyweight Squats',
        sets: 3,
        reps: 15,
        description: 'Stand with feet shoulder-width apart, lower your body by bending your knees, then return to standing.',
      },
    ],
  },
  {
    id: '2',
    title: 'Yoga Flow for Flexibility',
    description: 'Increase your flexibility and mindfulness with this yoga flow.',
    duration: 30,
    intensity: 'low',
    level: 'beginner',
    category: 'Yoga',
    exercises: [
      {
        id: 'e4',
        name: 'Sun Salutation',
        duration: 300,
        description: 'A sequence of yoga poses performed in a flowing motion, connecting breath with movement.',
      },
      {
        id: 'e5',
        name: 'Warrior Poses',
        duration: 300,
        description: 'A series of standing poses that build strength and improve focus.',
      },
      {
        id: 'e6',
        name: 'Seated Forward Bend',
        duration: 180,
        description: 'Sit with legs extended, fold forward from the hips, reaching toward your feet.',
      },
    ],
  },
  {
    id: '3',
    title: 'HIIT Cardio Blast',
    description: 'Intense cardio intervals to boost your metabolism.',
    duration: 25,
    intensity: 'high',
    level: 'intermediate',
    category: 'HIIT',
    exercises: [
      {
        id: 'e7',
        name: 'Burpees',
        sets: 4,
        reps: 10,
        description: 'Start standing, drop to a push-up, return to standing, then jump with hands overhead.',
      },
      {
        id: 'e8',
        name: 'Mountain Climbers',
        duration: 45,
        description: 'Start in a plank position and alternate bringing knees toward chest in a running motion.',
      },
      {
        id: 'e9',
        name: 'Jump Squats',
        sets: 3,
        reps: 15,
        description: 'Perform a squat, then explosively jump upward, landing softly back in the squat position.',
      },
    ],
  },
];

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>(sampleWorkouts);
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutHistory[]>([]);
  const [recommendedWorkouts, setRecommendedWorkouts] = useState<Workout[]>([]);
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading workout data
    const loadWorkouts = async () => {
      setIsLoading(true);
      // In a real app, fetch from API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setWorkouts(sampleWorkouts);
      
      // Generate workout history
      if (user) {
        const mockHistory: WorkoutHistory[] = [
          {
            id: 'h1',
            workoutId: '1',
            userId: user.id,
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            completed: true,
            duration: 22,
            feedback: {
              difficulty: 3,
              enjoyment: 4,
            },
          },
          {
            id: 'h2',
            workoutId: '2',
            userId: user.id,
            date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
            completed: true,
            duration: 32,
            feedback: {
              difficulty: 2,
              enjoyment: 5,
            },
          },
        ];
        setWorkoutHistory(mockHistory);
      }
      
      // Set recommended workouts (AI would do this in real app)
      setRecommendedWorkouts(sampleWorkouts.slice(0, 2));
      setIsLoading(false);
    };

    loadWorkouts();
  }, [user]);

  const startWorkout = (workoutId: string) => {
    const workout = workouts.find(w => w.id === workoutId);
    if (workout) {
      setCurrentWorkout(workout);
    }
  };

  const completeWorkout = (feedback: WorkoutHistory['feedback']) => {
    if (currentWorkout && user) {
      const newHistoryEntry: WorkoutHistory = {
        id: `h${Date.now()}`,
        workoutId: currentWorkout.id,
        userId: user.id,
        date: new Date(),
        completed: true,
        duration: currentWorkout.duration,
        feedback,
      };
      
      setWorkoutHistory(prev => [newHistoryEntry, ...prev]);
      setCurrentWorkout(null);
    }
  };

  const cancelWorkout = () => {
    setCurrentWorkout(null);
  };

  return (
    <WorkoutContext.Provider
      value={{
        workouts,
        recommendedWorkouts,
        workoutHistory,
        isLoading,
        currentWorkout,
        startWorkout,
        completeWorkout,
        cancelWorkout,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};
