
import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import DefaultLayout from '@/components/layout/DefaultLayout';
import { useAuth } from '@/context/AuthContext';
import { ChevronRight, Play, Users, Award, BarChart, Dumbbell, Zap, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const featuresRef = useRef<HTMLDivElement>(null);
  
  // Intersection Observer for scroll reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const scrollElements = document.querySelectorAll('.scroll-reveal');
    scrollElements.forEach((element) => {
      observer.observe(element);
    });
    
    return () => {
      scrollElements.forEach((element) => {
        observer.unobserve(element);
      });
    };
  }, []);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const features = [
    {
      icon: <Dumbbell className="h-8 w-8 text-primary" />,
      title: 'AI-Powered Workouts',
      description: 'Get personalized workout plans that adapt to your progress and preferences.',
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: 'Social Challenges',
      description: 'Join challenges with friends to stay motivated and accountable.',
    },
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: 'Gamified Experience',
      description: 'Earn achievements, track streaks, and level up as you build your fitness habit.',
    },
    {
      icon: <BarChart className="h-8 w-8 text-primary" />,
      title: 'Progress Tracking',
      description: 'Visualize your fitness journey with detailed analytics and insights.',
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: 'Adaptive Intensity',
      description: 'Workouts that evolve with you, ensuring optimal challenge and growth.',
    },
    {
      icon: <Play className="h-8 w-8 text-primary" />,
      title: 'Guided Exercises',
      description: 'Clear instructions and demonstrations for every exercise in your routine.',
    },
  ];
  
  const testimonials = [
    {
      name: 'Sarah J.',
      role: 'Working Professional',
      content: 'habitforge has been a game-changer for my fitness routine. The AI recommendations feel truly personalized, and the social challenges keep me accountable.',
      image: 'https://randomuser.me/api/portraits/women/32.jpg',
    },
    {
      name: 'Michael T.',
      role: 'Parent of Two',
      content: 'As a busy parent, I struggled to maintain consistency. The streak system and five-minute workouts have helped me exercise even on my busiest days.',
      image: 'https://randomuser.me/api/portraits/men/47.jpg',
    },
    {
      name: 'Elena R.',
      role: 'Fitness Beginner',
      content: 'I was intimidated by fitness apps before, but habitforge makes it approachable. I love how the workouts adapt to my feedback and progress.',
      image: 'https://randomuser.me/api/portraits/women/19.jpg',
    },
  ];
  
  const pricingTiers = [
    {
      name: 'Free',
      price: '$0',
      description: 'Start building your fitness habit',
      features: [
        'Basic workout library',
        'Activity tracking',
        'Public challenges',
        'Community access',
      ],
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'Premium',
      price: '$9.99',
      period: 'per month',
      description: 'Everything you need for fitness success',
      features: [
        'AI-powered personal workouts',
        'Advanced analytics and insights',
        'Unlimited custom challenges',
        'Premium badges and rewards',
        'Priority support',
        'Ad-free experience',
      ],
      cta: 'Start Free Trial',
      popular: true,
    },
  ];
  
  return (
    <DefaultLayout fullWidth>
      {/* Hero Section */}
      <section className="relative pb-20 pt-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background to-secondary opacity-80"></div>
          <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-radial from-primary/10 via-transparent to-transparent"></div>
        </div>
        
        <div className="container relative z-10 mx-auto px-4 md:px-6 flex flex-col items-center text-center">
          <span className="inline-block mb-6 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
            Habit-Forming Fitness Platform
          </span>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Transform Your Fitness Journey with
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent"> AI Personalization</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            habitforge combines AI-powered workout plans, social challenges, and gamification to help you build lasting fitness habits that fit your life.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-12 w-full max-w-md animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Link to={isAuthenticated ? "/dashboard" : "/signup"} className="flex-1">
              <Button className="w-full text-base py-6" size="lg">
                {isAuthenticated ? 'Go to Dashboard' : 'Start Free Trial'}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button variant="outline" className="flex-1 text-base py-6" size="lg" onClick={scrollToFeatures}>
              Explore Features
            </Button>
          </div>
          
          <div className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-2xl animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 backdrop-blur-sm glass">
              {/* This would be a video or animated demo in a real app */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <Play className="h-16 w-16 text-primary mb-4 animate-pulse-soft" />
                <h3 className="text-xl md:text-2xl font-semibold mb-2">Experience habitforge in Action</h3>
                <p className="text-muted-foreground max-w-lg">
                  See how AI personalization, social challenges, and gamification create an engaging fitness experience.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-4xl">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-primary mb-2">98%</div>
              <p className="text-sm text-muted-foreground text-center">User Satisfaction</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-primary mb-2">75%</div>
              <p className="text-sm text-muted-foreground text-center">Increased Consistency</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-primary mb-2">2x</div>
              <p className="text-sm text-muted-foreground text-center">Workout Completion</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-primary mb-2">10k+</div>
              <p className="text-sm text-muted-foreground text-center">Active Members</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section ref={featuresRef} className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose habitforge</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform is designed to make fitness engaging, personalized, and sustainable for your lifestyle.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="scroll-reveal bg-white p-8 rounded-2xl shadow-soft hover-grow hover:shadow-md transition-all duration-300"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="mb-5 p-2 rounded-lg bg-primary/10 inline-block">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* AI Section */}
      <section className="py-20 bg-secondary relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 scroll-reveal">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                AI-Powered Fitness, Tailored to Your Journey
              </h2>
              <p className="text-muted-foreground mb-6">
                Our advanced AI system learns from your workout patterns, preferences, and feedback to create a truly personalized fitness experience.
              </p>
              
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="mr-4 p-1 rounded-full bg-primary/20 text-primary">
                    <Check className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">Adaptive Difficulty</h4>
                    <p className="text-sm text-muted-foreground">
                      Workouts that automatically adjust based on your performance and feedback.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-4 p-1 rounded-full bg-primary/20 text-primary">
                    <Check className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">Smart Recommendations</h4>
                    <p className="text-sm text-muted-foreground">
                      Suggested workouts aligned with your goals, available time, and energy levels.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-4 p-1 rounded-full bg-primary/20 text-primary">
                    <Check className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">Progress-Based Planning</h4>
                    <p className="text-sm text-muted-foreground">
                      Long-term fitness plans that evolve as you grow stronger and more consistent.
                    </p>
                  </div>
                </li>
              </ul>
              
              <div className="mt-8">
                <Link to="/about">
                  <Button variant="outline">
                    Learn More
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="flex-1 scroll-reveal">
              <div className="rounded-2xl overflow-hidden shadow-lg bg-white p-1">
                <div className="bg-secondary rounded-xl p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-lg font-medium">Today's Recommendation</h3>
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">Personalized</span>
                  </div>
                  
                  <div className="bg-white rounded-lg p-5 mb-5">
                    <div className="flex items-start">
                      <div className="mr-4 p-2 rounded-lg bg-primary/10">
                        <Dumbbell className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Morning Energy Boost</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          20 min · Medium Intensity
                        </p>
                        <div className="w-full bg-secondary rounded-full h-2 mb-4">
                          <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Matches your morning workout preference and available time
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center p-3 bg-secondary/50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center mr-4">
                        <span className="text-primary font-medium">1</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Jumping Jacks</p>
                        <p className="text-xs text-muted-foreground">45 seconds</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-secondary/50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center mr-4">
                        <span className="text-primary font-medium">2</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Push-ups</p>
                        <p className="text-xs text-muted-foreground">3 sets × 10 reps</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-secondary/50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center mr-4">
                        <span className="text-primary font-medium">3</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Mountain Climbers</p>
                        <p className="text-xs text-muted-foreground">30 seconds</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button className="w-full">
                      Start Workout
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute top-1/4 right-0 transform -translate-x-1/4 w-[300px] h-[300px] rounded-full bg-accent/5 blur-3xl"></div>
      </section>
      
      {/* Social Challenges Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 order-2 lg:order-1 scroll-reveal">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-accent/10 rounded-2xl transform rotate-3"></div>
                <div className="relative bg-white p-6 rounded-2xl shadow-soft z-10">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">Weekend Warrior Challenge</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-1" />
                      <span>247 participants</span>
                      <span className="mx-2">•</span>
                      <span>3 days left</span>
                    </div>
                  </div>
                  
                  <div className="bg-secondary/50 p-4 rounded-lg mb-6">
                    <p className="text-sm">
                      Complete 3 high-intensity workouts this weekend to earn the Weekend Warrior badge and 150 XP!
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-sm font-medium mb-3">Leaderboard</h4>
                    <div className="space-y-3">
                      <div className="flex items-center p-3 bg-secondary/30 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                          <span className="text-primary font-medium">1</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Alex K.</p>
                        </div>
                        <div className="text-sm font-medium">3/3</div>
                      </div>
                      <div className="flex items-center p-3 bg-secondary/30 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                          <span className="text-primary font-medium">2</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Taylor S.</p>
                        </div>
                        <div className="text-sm font-medium">2/3</div>
                      </div>
                      <div className="flex items-center p-3 bg-secondary/30 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                          <span className="text-primary font-medium">3</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Jamie L.</p>
                        </div>
                        <div className="text-sm font-medium">1/3</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button className="flex-1">Join Challenge</Button>
                    <Button variant="outline" className="flex-1">Invite Friends</Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 order-1 lg:order-2 scroll-reveal">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Compete, Collaborate, and Conquer Together
              </h2>
              <p className="text-muted-foreground mb-8">
                Social motivation is one of the most powerful forces for habit formation. Our challenge system makes fitness a shared journey.
              </p>
              
              <div className="space-y-6">
                <div className="flex">
                  <div className="mr-4 p-2 rounded-full bg-primary/10 text-primary shrink-0">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium mb-1">Group Challenges</h4>
                    <p className="text-muted-foreground">
                      Team up with friends to reach collective goals and hold each other accountable.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4 p-2 rounded-full bg-primary/10 text-primary shrink-0">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium mb-1">Friendly Competition</h4>
                    <p className="text-muted-foreground">
                      Leaderboards and achievements that inspire healthy competition and motivation.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4 p-2 rounded-full bg-primary/10 text-primary shrink-0">
                    <Zap className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium mb-1">Multiplayer Workouts</h4>
                    <p className="text-muted-foreground">
                      Real-time workout sessions with friends, no matter where they are.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Link to="/challenges">
                  <Button>
                    Explore Challenges
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Members Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands who have transformed their fitness journey with habitforge.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="scroll-reveal bg-white p-8 rounded-2xl shadow-soft hover-lift"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="mb-6">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-primary">★</span>
                  ))}
                </div>
                <p className="mb-6 text-foreground/90 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h4 className="font-medium">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Start for free and upgrade when you're ready for more personalized features.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <div 
                key={index} 
                className={cn(
                  "scroll-reveal border rounded-2xl overflow-hidden",
                  tier.popular ? "shadow-lg border-primary/30" : "shadow-soft border-border"
                )}
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                {tier.popular && (
                  <div className="bg-primary text-primary-foreground py-2 text-center text-sm font-medium">
                    Most Popular
                  </div>
                )}
                
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    {tier.period && (
                      <span className="text-muted-foreground"> {tier.period}</span>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-6">{tier.description}</p>
                  
                  <ul className="space-y-4 mb-8">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <Check className="h-5 w-5 text-primary mr-3 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link to="/signup">
                    <Button 
                      className="w-full" 
                      variant={tier.popular ? "default" : "outline"}
                    >
                      {tier.cta}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 scroll-reveal">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Fitness Journey?
            </h2>
            <p className="text-primary-foreground/80 mb-8 text-lg">
              Join thousands of users who have built lasting fitness habits with habitforge. Start your free trial today.
            </p>
            <Link to="/signup">
              <Button size="lg" variant="secondary" className="text-base py-6 px-8">
                Get Started — It's Free
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
};

export default HomePage;
