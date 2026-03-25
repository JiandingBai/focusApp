import { Navigation } from '../components/Navigation';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useAppStore } from '../stores/useAppStore';
import { Link } from 'react-router';
import { Timer, Users, TrendingUp, CheckCircle, Target, Clock } from 'lucide-react';
import imgFrame2 from 'figma:asset/bc1f3b0f6a54eb1a8e1f1398fb79cd46335ef064.png';

export function Dashboard() {
  const { tasks, sessions, backgroundImage } = useAppStore();
  const bgImage = backgroundImage && backgroundImage !== 'none' ? backgroundImage : imgFrame2;
  
  const activeTasks = tasks.filter(t => !t.completed).length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const totalFocusTime = sessions.reduce((acc, s) => acc + s.duration, 0);
  const todaySessions = sessions.filter(s => {
    const today = new Date();
    const sessionDate = new Date(s.startTime);
    return sessionDate.toDateString() === today.toDateString();
  }).length;
  
  const stats = [
    { label: 'Active Tasks', value: activeTasks, icon: Target },
    { label: 'Completed', value: completedTasks, icon: CheckCircle },
    { label: 'Focus Hours', value: Math.floor(totalFocusTime / 3600), icon: Clock },
    { label: 'Today Sessions', value: todaySessions, icon: TrendingUp },
  ];
  
  const features = [
    {
      title: 'Personal Workspace',
      description: 'Organize tasks and focus with customizable timers',
      icon: Timer,
      to: '/workspace',
    },
    {
      title: 'Virtual Study Room',
      description: 'Study alongside others for social accountability',
      icon: Users,
      to: '/study-room',
    },
    {
      title: 'Track Progress',
      description: 'Visualize your productivity and study patterns',
      icon: TrendingUp,
      to: '/progress',
    },
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ffc4d6] via-[#ffb5c8] to-[#ffa3b8] font-['Inter',sans-serif]">
      <Navigation />
      
      {/* Header bars */}
      <div className="fixed top-2 left-[70px] right-2 flex justify-between items-center z-40">
        <div className="bg-muted rounded-[5px] px-4 py-2">
          <p className="text-xs text-black">Title/Name</p>
        </div>
        <div className="bg-muted rounded-[5px] px-4 py-2">
          <p className="text-xs text-black">Title/Name</p>
        </div>
      </div>
      
      <main className="pt-16 pb-8 px-4 ml-[70px]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-5xl font-bold text-black">
              Welcome to FocusSpace
            </h1>
            
            <p className="text-lg text-black/80 max-w-2xl mx-auto">
              A customizable digital workspace designed to help you maintain attention during cognitively demanding activities
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className="p-6 text-center border-sidebar-border bg-card/80 backdrop-blur-sm">
                  <Icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="text-3xl font-bold text-black">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </Card>
              );
            })}
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.title} to={feature.to}>
                  <Card className="p-6 h-full hover:shadow-lg transition-all group cursor-pointer border-sidebar-border bg-card/80 backdrop-blur-sm">
                    <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-2 text-black">{feature.title}</h3>
                    <p className="text-muted-foreground mb-4">{feature.description}</p>
                    
                    <Button variant="ghost" className="group-hover:translate-x-1 transition-transform">
                      Get Started →
                    </Button>
                  </Card>
                </Link>
              );
            })}
          </div>
          
          <Card className="p-8 mt-12 bg-primary/20 border-primary backdrop-blur-sm">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-bold mb-3 text-black">
                Built on Attention Restoration Theory
              </h2>
              <p className="text-black/80 mb-6">
                Our app helps you manage tasks, take restorative breaks, and maintain steady progress 
                without rigid systems. Features include flexible Pomodoro timers, ambient environments, 
                and virtual co-working spaces for social accountability.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/workspace">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Start Focusing
                  </Button>
                </Link>
                <Link to="/study-room">
                  <Button size="lg" variant="outline" className="border-primary text-black hover:bg-primary/10">
                    Join Study Room
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}