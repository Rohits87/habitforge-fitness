
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const workoutTypes = [
  { value: "weightlifting", label: "Weightlifting" },
  { value: "cardio", label: "Cardio" },
  { value: "hiit", label: "HIIT" },
  { value: "yoga", label: "Yoga" },
  { value: "bodyweight", label: "Bodyweight" },
  { value: "calisthenics", label: "Calisthenics" },
];

const fitnessGoals = [
  { value: "weight-loss", label: "Weight Loss" },
  { value: "muscle-gain", label: "Muscle Gain" },
  { value: "endurance", label: "Endurance" },
  { value: "strength", label: "Strength" },
  { value: "flexibility", label: "Flexibility" },
  { value: "overall-fitness", label: "Overall Fitness" },
];

const workoutDurations = [
  { value: "15", label: "15 Minutes" },
  { value: "30", label: "30 Minutes" },
  { value: "45", label: "45 Minutes" },
  { value: "60", label: "60 Minutes" },
  { value: "90", label: "90 Minutes" },
];

type OnboardingFormProps = {
  onComplete: () => void;
};

const OnboardingForm = ({ onComplete }: OnboardingFormProps) => {
  const { user, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [name, setName] = useState(user?.name || "");
  const [age, setAge] = useState("");
  const [fitnessLevel, setFitnessLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [preferredWorkouts, setPreferredWorkouts] = useState<string[]>([]);
  const [duration, setDuration] = useState("60");
  const [goals, setGoals] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateUserProfile({
        name,
        fitnessLevel,
        preferredWorkouts,
        goals,
        age: parseInt(age),
        workoutDuration: parseInt(duration),
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully set up!",
      });
      
      onComplete();
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: error.message || "An error occurred while updating your profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWorkoutTypeChange = (value: string) => {
    if (preferredWorkouts.includes(value)) {
      setPreferredWorkouts(preferredWorkouts.filter(type => type !== value));
    } else {
      setPreferredWorkouts([...preferredWorkouts, value]);
    }
  };

  const handleGoalChange = (value: string) => {
    if (goals.includes(value)) {
      setGoals(goals.filter(goal => goal !== value));
    } else {
      setGoals([...goals, value]);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Welcome to Your Fitness Journey</CardTitle>
          <CardDescription>
            Let's set up your profile to personalize your workout experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Your Name</label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="age" className="text-sm font-medium">Age</label>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Enter your age"
                min="18"
                max="100"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="fitnessLevel" className="text-sm font-medium">Fitness Level</label>
              <Select 
                value={fitnessLevel} 
                onValueChange={(value: "beginner" | "intermediate" | "advanced") => setFitnessLevel(value)}
              >
                <SelectTrigger id="fitnessLevel">
                  <SelectValue placeholder="Select your fitness level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Preferred Workout Types</label>
              <div className="flex flex-wrap gap-2">
                {workoutTypes.map((type) => (
                  <Button
                    key={type.value}
                    type="button"
                    variant={preferredWorkouts.includes(type.value) ? "default" : "outline"}
                    onClick={() => handleWorkoutTypeChange(type.value)}
                    className="text-sm"
                  >
                    {type.label}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="duration" className="text-sm font-medium">Workout Duration</label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger id="duration">
                  <SelectValue placeholder="Select workout duration" />
                </SelectTrigger>
                <SelectContent>
                  {workoutDurations.map((duration) => (
                    <SelectItem key={duration.value} value={duration.value}>
                      {duration.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Fitness Goals</label>
              <div className="flex flex-wrap gap-2">
                {fitnessGoals.map((goal) => (
                  <Button
                    key={goal.value}
                    type="button"
                    variant={goals.includes(goal.value) ? "default" : "outline"}
                    onClick={() => handleGoalChange(goal.value)}
                    className="text-sm"
                  >
                    {goal.label}
                  </Button>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full mt-6" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save and Continue"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingForm;
