
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menu, X, Award, Dumbbell, User, BarChart2, Flame } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  
  // Track scroll position for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <BarChart2 className="w-5 h-5 mr-2" /> },
    { name: 'Workouts', path: '/workouts', icon: <Dumbbell className="w-5 h-5 mr-2" /> },
    { name: 'Challenges', path: '/challenges', icon: <Award className="w-5 h-5 mr-2" /> },
    { name: 'Achievements', path: '/achievements', icon: <Flame className="w-5 h-5 mr-2" /> },
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-4 transition-all duration-300",
        isScrolled ? "bg-background/80 backdrop-blur-lg shadow-sm" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            WillfulyFit
          </span>
        </Link>
        
        {!isMobile && (
          <nav className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                {navItems.map((item) => (
                  <Link 
                    key={item.path} 
                    to={item.path}
                    className="text-sm font-medium transition-colors hover:text-primary link-underline"
                  >
                    {item.name}
                  </Link>
                ))}
              </>
            ) : (
              <>
                <Link 
                  to="/about" 
                  className="text-sm font-medium transition-colors hover:text-primary link-underline"
                >
                  About
                </Link>
                <Link 
                  to="/pricing" 
                  className="text-sm font-medium transition-colors hover:text-primary link-underline"
                >
                  Pricing
                </Link>
              </>
            )}
          </nav>
        )}
        
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/profile">
                <Avatar className="cursor-pointer hover-lift">
                  <AvatarImage src={user?.photoURL} />
                  <AvatarFallback>
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Link>
              
              {isMobile && (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                    <div className="flex flex-col h-full">
                      <div className="px-6 py-8 flex flex-col items-center">
                        <Avatar className="h-20 w-20 mb-4">
                          <AvatarImage src={user?.photoURL} />
                          <AvatarFallback className="text-xl">
                            {user?.name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="text-xl font-semibold mb-1">{user?.name}</h3>
                        <p className="text-sm text-muted-foreground">Level 2 Fitness Enthusiast</p>
                      </div>
                      
                      <nav className="flex-1 px-6">
                        <ul className="space-y-4">
                          {navItems.map((item) => (
                            <li key={item.path}>
                              <Link 
                                to={item.path} 
                                className="flex items-center py-2 px-4 rounded-md hover:bg-secondary transition-colors"
                              >
                                {item.icon}
                                <span>{item.name}</span>
                              </Link>
                            </li>
                          ))}
                          <li>
                            <Link 
                              to="/profile" 
                              className="flex items-center py-2 px-4 rounded-md hover:bg-secondary transition-colors"
                            >
                              <User className="w-5 h-5 mr-2" />
                              <span>Profile</span>
                            </Link>
                          </li>
                        </ul>
                      </nav>
                      
                      <div className="p-6 border-t">
                        <Button 
                          variant="outline" 
                          className="w-full" 
                          onClick={handleLogout}
                        >
                          Sign Out
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              )}
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Log In</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign Up</Button>
              </Link>
              
              {isMobile && (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                    <div className="flex justify-end">
                      <Button variant="ghost" size="icon" className="mb-6">
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                    <nav className="flex flex-col gap-4">
                      <Link 
                        to="/about" 
                        className="px-6 py-3 text-lg font-medium border-b"
                      >
                        About
                      </Link>
                      <Link 
                        to="/pricing" 
                        className="px-6 py-3 text-lg font-medium border-b"
                      >
                        Pricing
                      </Link>
                      <div className="mt-8 px-6 space-y-4">
                        <Link to="/login">
                          <Button variant="outline" className="w-full">
                            Log In
                          </Button>
                        </Link>
                        <Link to="/signup">
                          <Button className="w-full">
                            Sign Up
                          </Button>
                        </Link>
                      </div>
                    </nav>
                  </SheetContent>
                </Sheet>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
