import { useState, useEffect } from 'react';
import { Navigation } from '../components/Navigation';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { useAppStore } from '../stores/useAppStore';
import { Users, LogIn, LogOut, Clock, Target, TrendingUp, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import imgFrame2 from 'figma:asset/bc1f3b0f6a54eb1a8e1f1398fb79cd46335ef064.png';

interface StudyMate {
  id: string;
  name: string;
  status: 'focusing' | 'break';
  timeSpent: number;
  tasksCompleted: number;
  currentTask?: string;
}

// Mock study mates for demo
const MOCK_STUDY_MATES: StudyMate[] = [
  { id: '1', name: 'Ann', status: 'focusing', timeSpent: 125, tasksCompleted: 3, currentTask: 'Reading Chapter 5' },
  { id: '2', name: 'Ben', status: 'focusing', timeSpent: 89, tasksCompleted: 2, currentTask: 'Studying for Midterm' },
  { id: '3', name: 'Carlos', status: 'break', timeSpent: 56, tasksCompleted: 1 },
  { id: '4', name: 'Diana', status: 'focusing', timeSpent: 203, tasksCompleted: 5, currentTask: 'Problem Set 3' },
];

export function StudyRoom() {
  const { username, isInStudyRoom, setUsername, joinStudyRoom, leaveStudyRoom } = useAppStore();
  const [inputName, setInputName] = useState(username);
  const [studyMates, setStudyMates] = useState<StudyMate[]>(MOCK_STUDY_MATES);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ user: string; text: string; time: Date }[]>([
    { user: 'System', text: 'Welcome to the study room! Stay focused together.', time: new Date() },
  ]);
  
  const handleJoin = () => {
    if (!inputName.trim()) {
      toast.error('Please enter your name');
      return;
    }
    
    setUsername(inputName);
    joinStudyRoom();
    toast.success('Joined the study room!');
  };
  
  const handleLeave = () => {
    leaveStudyRoom();
    toast.success('Left the study room');
  };
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    setMessages(prev => [...prev, {
      user: username,
      text: message,
      time: new Date(),
    }]);
    setMessage('');
  };
  
  // Simulate activity updates
  useEffect(() => {
    if (!isInStudyRoom) return;
    
    const interval = setInterval(() => {
      setStudyMates(prev => prev.map(mate => ({
        ...mate,
        timeSpent: mate.status === 'focusing' ? mate.timeSpent + 1 : mate.timeSpent,
      })));
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [isInStudyRoom]);
  
  if (!isInStudyRoom) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-rose-950">
        <Navigation />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8"
          >
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center">
              <Users className="w-10 h-10 text-white" />
            </div>
            
            <div className="space-y-3">
              <h1 className="text-4xl font-bold">Virtual Study Room</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Study alongside others for social accountability and motivation. See what others are working on and stay focused together.
              </p>
            </div>
            
            <Card className="max-w-md mx-auto p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Enter your name to join</label>
                <Input
                  placeholder="Your name..."
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                  autoFocus
                />
              </div>
              
              <Button onClick={handleJoin} className="w-full" size="lg">
                <LogIn className="w-4 h-4 mr-2" />
                Join Study Room
              </Button>
              
              <div className="pt-4 border-t space-y-3">
                <p className="text-sm text-muted-foreground text-center">
                  Currently in the room:
                </p>
                <div className="flex justify-center gap-2">
                  {studyMates.slice(0, 4).map((mate) => (
                    <Avatar key={mate.id} className="w-10 h-10">
                      <AvatarFallback>{mate.name[0]}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <p className="text-sm text-center text-muted-foreground">
                  {studyMates.length} people studying
                </p>
              </div>
            </Card>
          </motion.div>
        </main>
      </div>
    );
  }
  
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Study Room</h1>
            <p className="text-muted-foreground">
              {studyMates.length + 1} people studying together
            </p>
          </div>
          
          <Button onClick={handleLeave} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Leave Room
          </Button>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h3 className="mb-4">Study Mates</h3>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <AnimatePresence>
                  {studyMates.map((mate, index) => (
                    <motion.div
                      key={mate.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="p-4">
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarFallback>{mate.name[0]}</AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium">{mate.name}</p>
                              <Badge
                                variant={mate.status === 'focusing' ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {mate.status === 'focusing' ? '🧠 Focusing' : '☕ Break'}
                              </Badge>
                            </div>
                            
                            {mate.currentTask && (
                              <p className="text-sm text-muted-foreground mb-2 truncate">
                                {mate.currentTask}
                              </p>
                            )}
                            
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {Math.floor(mate.timeSpent / 60)}h {mate.timeSpent % 60}m
                              </div>
                              <div className="flex items-center gap-1">
                                <Target className="w-3 h-3" />
                                {mate.tasksCompleted} tasks
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </Card>
            
            <Card className="p-6">
              <h3 className="mb-4">Group Progress</h3>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-accent/50 rounded-lg">
                  <TrendingUp className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">
                    {studyMates.reduce((acc, m) => acc + m.timeSpent, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Minutes</p>
                </div>
                
                <div className="text-center p-4 bg-accent/50 rounded-lg">
                  <Target className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">
                    {studyMates.reduce((acc, m) => acc + m.tasksCompleted, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Tasks Done</p>
                </div>
                
                <div className="text-center p-4 bg-accent/50 rounded-lg">
                  <Users className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">
                    {studyMates.filter(m => m.status === 'focusing').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Focusing Now</p>
                </div>
              </div>
            </Card>
          </div>
          
          <div>
            <Card className="p-4 h-[600px] flex flex-col">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                <MessageCircle className="w-5 h-5" />
                <h3 className="text-sm font-medium">Chat</h3>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                {messages.map((msg, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-primary">
                        {msg.user}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm bg-accent/50 rounded-lg p-2">
                      {msg.text}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Send encouragement..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button onClick={handleSendMessage}>Send</Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}