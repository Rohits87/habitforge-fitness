
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type WorkoutRequest = {
  userId: string;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  goals?: string[];
  preferredWorkouts?: string[];
  duration?: number; // in minutes
  equipment?: string[]; // available equipment
}

type Exercise = {
  name: string;
  sets: number;
  reps: number;
  restTime: number; // in seconds
  description: string;
}

type Workout = {
  id: string;
  name: string;
  description: string;
  targetMuscleGroups: string[];
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  exercises: Exercise[];
  createdAt: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, fitnessLevel, goals, preferredWorkouts, duration, equipment } = await req.json() as WorkoutRequest;
    
    if (!userId || !fitnessLevel) {
      return new Response(
        JSON.stringify({ error: 'userId and fitnessLevel are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Generate workout based on user preferences
    const workout = generateWorkout(fitnessLevel, goals, preferredWorkouts, duration, equipment);
    
    return new Response(
      JSON.stringify(workout),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating workout:', error);
    
    return new Response(
      JSON.stringify({ error: 'Failed to generate workout' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function generateWorkout(
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced',
  goals?: string[],
  preferredWorkouts?: string[],
  duration: number = 60,
  equipment?: string[]
): Workout {
  // This is a simplified version that generates workouts based on fitness level
  // In a production environment, you would integrate with an AI model
  
  const workouts: Record<string, Workout> = {
    'beginner': {
      id: crypto.randomUUID(),
      name: 'Beginner Full Body Workout',
      description: 'A gentle introduction to full body resistance training.',
      targetMuscleGroups: ['chest', 'back', 'legs', 'core'],
      duration: duration,
      difficulty: 'beginner',
      exercises: [
        {
          name: 'Push-ups',
          sets: 3,
          reps: 10,
          restTime: 60,
          description: 'Keep your body straight and lower until your chest nearly touches the floor.'
        },
        {
          name: 'Bodyweight Squats',
          sets: 3,
          reps: 15,
          restTime: 60,
          description: 'Stand with feet shoulder-width apart, lower your body as if sitting in a chair.'
        },
        {
          name: 'Plank',
          sets: 3,
          reps: 1,
          restTime: 60,
          description: 'Hold the position for 30 seconds, keeping your body in a straight line.'
        },
        {
          name: 'Glute Bridges',
          sets: 3,
          reps: 12,
          restTime: 60,
          description: 'Lie on your back with knees bent, lift your hips toward the ceiling.'
        }
      ],
      createdAt: new Date().toISOString()
    },
    'intermediate': {
      id: crypto.randomUUID(),
      name: 'Intermediate Split Workout',
      description: 'A challenging workout targeting multiple muscle groups.',
      targetMuscleGroups: ['chest', 'shoulders', 'triceps', 'core'],
      duration: duration,
      difficulty: 'intermediate',
      exercises: [
        {
          name: 'Dumbbell Bench Press',
          sets: 4,
          reps: 12,
          restTime: 90,
          description: 'Lie on a bench with a dumbbell in each hand, press weights upward until arms are extended.'
        },
        {
          name: 'Dumbbell Shoulder Press',
          sets: 4,
          reps: 10,
          restTime: 90,
          description: 'Sitting or standing, press dumbbells upward until arms are fully extended.'
        },
        {
          name: 'Tricep Dips',
          sets: 3,
          reps: 12,
          restTime: 60,
          description: 'Using parallel bars or a bench, lower your body by bending your elbows.'
        },
        {
          name: 'Russian Twists',
          sets: 3,
          reps: 20,
          restTime: 60,
          description: 'Sitting with knees bent, twist your torso from side to side.'
        }
      ],
      createdAt: new Date().toISOString()
    },
    'advanced': {
      id: crypto.randomUUID(),
      name: 'Advanced HIIT Workout',
      description: 'A high-intensity interval training session for experienced athletes.',
      targetMuscleGroups: ['full body', 'cardiovascular'],
      duration: duration,
      difficulty: 'advanced',
      exercises: [
        {
          name: 'Burpees',
          sets: 5,
          reps: 15,
          restTime: 45,
          description: 'From standing, drop to a plank, do a push-up, jump feet forward, then jump up.'
        },
        {
          name: 'Box Jumps',
          sets: 5,
          reps: 12,
          restTime: 45,
          description: 'Jump onto a raised platform and step back down.'
        },
        {
          name: 'Kettlebell Swings',
          sets: 5,
          reps: 20,
          restTime: 45,
          description: 'Using a kettlebell, swing from between legs to chest height using hip drive.'
        },
        {
          name: 'Mountain Climbers',
          sets: 5,
          reps: 30,
          restTime: 45,
          description: 'In plank position, rapidly alternate bringing knees toward chest.'
        }
      ],
      createdAt: new Date().toISOString()
    }
  };
  
  // For now, simply return a workout based on fitness level
  // In a production environment, this would be generated by the AI model
  return workouts[fitnessLevel];
}
