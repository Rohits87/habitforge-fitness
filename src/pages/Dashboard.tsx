import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Loader2, Calendar, Dumbbell, Clock } from 'lucide-react';
import { toast } from 'sonner';

type Exercise = {
  name: string;
  sets: number;
  reps: number;
  restTime: number;
  description: string;
};

type Workout = {
  id: string;
  name: string;
  description: string;
  targetMuscleGroups: string[];
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  exercises: Exercise[];
  createdAt: string;
};

const Dashboard = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, navigate]);

  const generateWorkout = async () => {
    if (!user) return;
    
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-workout', {
        body: {
          userId: user.id,
          fitnessLevel: user.fitnessLevel,
          goals: user.goals,
          preferredWorkouts: user.preferredWorkouts,
          duration: 60 // Default to 60 minutes
        }
      });
      
      if (error) throw error;
      
      setWorkout(data);
      toast.success('Your daily workout has been generated!');
    } catch (error) {
      console.error('Error generating workout:', error);
      toast.error('Failed to generate workout. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user?.name}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-3">Today's Workout</h2>
          {workout ? (
            <div>
              <p className="text-gray-600 mb-4">Your custom workout for today is ready!</p>
              <Button 
                onClick={() => setWorkout(null)} 
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                Generate New Workout
              </Button>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 mb-4">No workouts scheduled for today. Get started with a quick session!</p>
              <Button 
                onClick={generateWorkout}
                disabled={isGenerating}
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Calendar className="mr-2 h-4 w-4" />
                    Generate Workout
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-3">Your Streak</h2>
          <div className="flex items-center justify-between mb-4">
            <span className="text-4xl font-bold text-primary">0</span>
            <span className="text-gray-500">days</span>
          </div>
          <p className="text-gray-600">Start your streak by completing your first workout!</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-3">Upcoming Challenges</h2>
          <p className="text-gray-600 mb-4">No active challenges. Join one to compete with others!</p>
          <Button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
            Browse Challenges
          </Button>
        </div>
      </div>

      {workout && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">{workout.name}</h2>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
              {workout.difficulty.charAt(0).toUpperCase() + workout.difficulty.slice(1)}
            </span>
          </div>
          
          <p className="text-gray-600 mb-4">{workout.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {workout.targetMuscleGroups.map((muscle, index) => (
              <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                {muscle.charAt(0).toUpperCase() + muscle.slice(1)}
              </span>
            ))}
          </div>
          
          <div className="flex items-center text-gray-500 mb-6">
            <Clock className="mr-1 h-4 w-4" />
            <span>{workout.duration} minutes</span>
          </div>
          
          <h3 className="text-xl font-semibold mb-4">Exercises</h3>
          
          <div className="space-y-4">
            {workout.exercises.map((exercise, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-medium">{exercise.name}</h4>
                  <div className="text-sm font-medium">
                    {exercise.sets} sets &times; {exercise.reps} reps
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-2">{exercise.description}</p>
                <div className="text-xs text-gray-500">
                  Rest: {exercise.restTime} seconds between sets
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex justify-center">
            <Button className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors">
              <Dumbbell className="mr-2 h-4 w-4" />
              Start Workout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
