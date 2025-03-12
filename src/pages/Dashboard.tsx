import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Loader2, Calendar, Dumbbell, Clock, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import OnboardingForm from '@/components/OnboardingForm';
import WorkoutExclusionsDialog from '@/components/WorkoutExclusionsDialog';

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
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [exclusionsOpen, setExclusionsOpen] = useState(false);
  const [excludedBodyParts, setExcludedBodyParts] = useState<string[]>([]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    } else if (isAuthenticated && user) {
      const hasCompletedOnboarding = user.fitnessLevel && user.goals && user.goals.length > 0;
      setShowOnboarding(!hasCompletedOnboarding);
    }
  }, [isLoading, isAuthenticated, navigate, user]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out. Please try again.');
    }
  };

  const generateWorkout = async () => {
    if (!user) return;
    
    setExclusionsOpen(true);
  };
  
  const handleGenerateWithExclusions = async () => {
    if (!user) return;
    
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-workout', {
        body: {
          userId: user.id,
          fitnessLevel: user.fitnessLevel,
          goals: user.goals,
          preferredWorkouts: user.preferredWorkouts,
          duration: 60,
          excludeBodyParts: excludedBodyParts
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
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (showOnboarding) {
    return <OnboardingForm onComplete={() => setShowOnboarding(false)} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
      
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
      
      <WorkoutExclusionsDialog 
        open={exclusionsOpen}
        onClose={() => setExclusionsOpen(false)}
        excludedBodyParts={excludedBodyParts}
        setExcludedBodyParts={setExcludedBodyParts}
        onConfirm={() => {
          setExclusionsOpen(false);
          handleGenerateWithExclusions();
        }}
      />
    </div>
  );
};

export default Dashboard;
