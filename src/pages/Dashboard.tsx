
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Dashboard = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, navigate]);

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-3">Today's Workout</h2>
          <p className="text-gray-600 mb-4">No workouts scheduled for today. Get started with a quick session!</p>
          <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
            Start Workout
          </button>
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
          <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
            Browse Challenges
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
