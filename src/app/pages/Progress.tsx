import { Navigation } from '../components/Navigation';
import { Card } from '../components/ui/card';
import { useAppStore } from '../stores/useAppStore';
import { format, startOfWeek, eachDayOfInterval, subDays, isToday, endOfWeek } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';
import { CheckCircle, Clock, Target, TrendingUp, Calendar, Award } from 'lucide-react';
import { motion } from 'motion/react';
import imgFrame2 from '../../assets/bc1f3b0f6a54eb1a8e1f1398fb79cd46335ef064.png';

export function Progress() {
  const { tasks, sessions, backgroundImage } = useAppStore();
  const bgImage = backgroundImage && backgroundImage !== 'none' ? backgroundImage : imgFrame2;
  
  // Calculate stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const totalFocusMinutes = sessions.reduce((acc, s) => acc + Math.floor(s.duration / 60), 0);
  const totalFocusHours = Math.floor(totalFocusMinutes / 60);
  
  const today = new Date();
  const todaySessions = sessions.filter(s => {
    const sessionDate = new Date(s.startTime);
    return sessionDate.toDateString() === today.toDateString();
  });
  const todayMinutes = todaySessions.reduce((acc, s) => acc + Math.floor(s.duration / 60), 0);
  
  // Weekly data
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  const weeklyData = weekDays.map(day => {
    const daySessions = sessions.filter(s => {
      const sessionDate = new Date(s.startTime);
      return sessionDate.toDateString() === day.toDateString();
    });
    
    return {
      id: day.toISOString(), // Add unique ID
      day: format(day, 'EEE'),
      minutes: daySessions.reduce((acc, s) => acc + Math.floor(s.duration / 60), 0),
      sessions: daySessions.length,
      isToday: isToday(day),
    };
  });
  
  // Task priority distribution
  const priorityData = [
    { name: 'High', value: tasks.filter(t => t.priority === 'high').length, color: '#ef4444' },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length, color: '#f59e0b' },
    { name: 'Low', value: tasks.filter(t => t.priority === 'low').length, color: '#10b981' },
  ].filter(d => d.value > 0);
  
  // Streak calculation (mock for demo)
  const currentStreak = 5;
  const longestStreak = 12;
  
  const stats = [
    { 
      label: 'Total Focus Time', 
      value: `${totalFocusHours}h ${totalFocusMinutes % 60}m`, 
      icon: Clock, 
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    { 
      label: 'Completion Rate', 
      value: `${completionRate}%`, 
      icon: Target, 
      color: 'text-green-500',
      bg: 'bg-green-500/10'
    },
    { 
      label: 'Total Sessions', 
      value: sessions.length, 
      icon: TrendingUp, 
      color: 'text-purple-500',
      bg: 'bg-purple-500/10'
    },
    { 
      label: 'Current Streak', 
      value: `${currentStreak} days`, 
      icon: CheckCircle, 
      color: 'text-orange-500',
      bg: 'bg-orange-500/10'
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Your Progress</h1>
          <p className="text-muted-foreground">
            Track your productivity and identify patterns
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="p-6">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </Card>
            );
          })}
        </motion.div>
        
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <h3 className="mb-4">Weekly Focus Time</h3>
              
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: any) => [`${value} minutes`, 'Focus Time']}
                  />
                  <Bar 
                    dataKey="minutes" 
                    fill="hsl(var(--primary))" 
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
              
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Today: <span className="font-semibold text-foreground">{todayMinutes} minutes</span> across {todaySessions.length} sessions
                </p>
              </div>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <h3 className="mb-4">Session Consistency</h3>
              
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: any) => [`${value} sessions`, 'Count']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sessions" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Average: <span className="font-semibold text-foreground">
                    {Math.round(weeklyData.reduce((acc, d) => acc + d.sessions, 0) / weeklyData.length)}
                  </span> sessions per day
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6">
              <h3 className="mb-4">Task Priority Distribution</h3>
              
              {priorityData.length > 0 ? (
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={priorityData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {priorityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                  No tasks yet
                </div>
              )}
              
              <div className="mt-4 pt-4 border-t space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Completed Tasks</span>
                  <span className="font-semibold">{completedTasks} / {totalTasks}</span>
                </div>
              </div>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6">
              <h3 className="mb-6">Achievements</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">🔥 {currentStreak} Day Streak</p>
                    <p className="text-sm text-muted-foreground">Keep it going!</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-accent/50 rounded-lg">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold">Best Streak: {longestStreak} Days</p>
                    <p className="text-sm text-muted-foreground">Personal record</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-accent/50 rounded-lg">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold">{completedTasks} Tasks Completed</p>
                    <p className="text-sm text-muted-foreground">Great progress!</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}