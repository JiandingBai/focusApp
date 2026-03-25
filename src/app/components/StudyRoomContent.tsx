import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { useAppStore } from '../stores/useAppStore';
import { Users, LogIn, LogOut, Clock, Target, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

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

export function StudyRoomContent() {
  const { username, isInStudyRoom, setUsername, joinStudyRoom, leaveStudyRoom } = useAppStore();
  const [inputName, setInputName] = useState(username);
  const [studyMates] = useState<StudyMate[]>(MOCK_STUDY_MATES);
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
    
    setMessages([
      ...messages,
      { user: username, text: message, time: new Date() },
    ]);
    setMessage('');
  };
  
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };
  
  if (!isInStudyRoom) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-3">
          <Users className="w-16 h-16 mx-auto text-primary" />
          <h2 className="text-2xl font-semibold">Virtual Study Room</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Join others in a virtual study space for social accountability and motivation
          </p>
        </div>
        
        <Card className="p-6 max-w-md mx-auto">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Your Name</label>
              <Input
                placeholder="Enter your name..."
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
              />
            </div>
            
            <Button onClick={handleJoin} className="w-full" size="lg">
              <LogIn className="w-4 h-4 mr-2" />
              Join Study Room
            </Button>
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="font-semibold mb-3">Currently Studying ({studyMates.length})</h3>
          <div className="space-y-2">
            {studyMates.map((mate) => (
              <div key={mate.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-accent/50">
                <Avatar>
                  <AvatarFallback>{mate.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{mate.name}</p>
                  {mate.currentTask && (
                    <p className="text-xs text-muted-foreground">{mate.currentTask}</p>
                  )}
                </div>
                <Badge variant={mate.status === 'focusing' ? 'default' : 'secondary'}>
                  {mate.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-xl font-semibold">Study Room</h2>
            <p className="text-sm text-muted-foreground">{studyMates.length + 1} people studying</p>
          </div>
        </div>
        
        <Button onClick={handleLeave} variant="outline">
          <LogOut className="w-4 h-4 mr-2" />
          Leave Room
        </Button>
      </div>
      
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <Clock className="w-8 h-8 mx-auto mb-2 text-primary" />
          <p className="text-2xl font-bold">
            {formatTime(studyMates.reduce((acc, m) => acc + m.timeSpent, 0) / studyMates.length)}
          </p>
          <p className="text-xs text-muted-foreground">Average Focus Time</p>
        </Card>
        
        <Card className="p-4 text-center">
          <Target className="w-8 h-8 mx-auto mb-2 text-primary" />
          <p className="text-2xl font-bold">
            {studyMates.reduce((acc, m) => acc + m.tasksCompleted, 0)}
          </p>
          <p className="text-xs text-muted-foreground">Total Tasks Completed</p>
        </Card>
        
        <Card className="p-4 text-center">
          <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
          <p className="text-2xl font-bold">
            {studyMates.filter(m => m.status === 'focusing').length}
          </p>
          <p className="text-xs text-muted-foreground">Currently Focusing</p>
        </Card>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Study Mates
          </h3>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            <AnimatePresence>
              {studyMates.map((mate) => (
                <motion.div
                  key={mate.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="p-3 rounded-md bg-accent/50"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs">{mate.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{mate.name}</p>
                        <Badge
                          variant={mate.status === 'focusing' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {mate.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {formatTime(mate.timeSpent)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {mate.tasksCompleted} tasks
                      </p>
                    </div>
                  </div>
                  {mate.currentTask && (
                    <p className="text-xs text-muted-foreground truncate">
                      {mate.currentTask}
                    </p>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </Card>
        
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Group Chat
          </h3>
          <div className="space-y-3">
            <div className="h-[200px] overflow-y-auto space-y-2 mb-3 p-2 bg-accent/20 rounded-md">
              {messages.map((msg, idx) => (
                <div key={idx} className="text-sm">
                  <span className="font-medium text-primary">{msg.user}: </span>
                  <span>{msg.text}</span>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Input
                placeholder="Send a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button onClick={handleSendMessage}>Send</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
