import { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../../stores/useAppStore';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Card } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { toast } from 'sonner';
import { Play, Pause, RotateCcw, Settings, AlertCircle } from 'lucide-react';

interface SessionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SessionModal({ isOpen, onClose }: SessionModalProps) {
  const {
    tasks,
    focusDuration,
    breakDuration,
    setFocusDuration,
    setBreakDuration,
    updateTask,
    addSession,
  } = useAppStore();
  
  const [showSettings, setShowSettings] = useState(false);
  const [tempFocusDuration, setTempFocusDuration] = useState(focusDuration);
  const [tempBreakDuration, setTempBreakDuration] = useState(breakDuration);
  
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(focusDuration * 60);
  const [totalTime, setTotalTime] = useState(focusDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [showTaskPrompt, setShowTaskPrompt] = useState(true);
  const [showBreakWarning, setShowBreakWarning] = useState(false);
  const [showTimeUpPrompt, setShowTimeUpPrompt] = useState(false);
  const [overtimeSeconds, setOvertimeSeconds] = useState(0);
  
  const sessionStartRef = useRef<Date | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const activeTasks = tasks.filter(t => !t.completed);
  
  useEffect(() => {
    if (mode === 'focus') {
      setTotalTime(focusDuration * 60);
      setTimeLeft(focusDuration * 60);
    } else {
      setTotalTime(breakDuration * 60);
      setTimeLeft(breakDuration * 60);
    }
    setOvertimeSeconds(0);
  }, [mode, focusDuration, breakDuration]);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (mode === 'focus') {
              // Time's up for focus - show prompt but keep counting
              setShowTimeUpPrompt(true);
              playCompletionSound();
              setOvertimeSeconds(0);
              return 0;
            } else {
              // Break time - show warning at 1 minute left
              if (prev === 60) {
                setShowBreakWarning(true);
                toast.warning('Break ending in 1 minute!');
              }
              if (prev <= 1) {
                // Break is over
                playCompletionSound();
                setShowBreakWarning(false);
                setShowTaskPrompt(true);
                setMode('focus');
                setIsRunning(false);
                return breakDuration * 60;
              }
            }
          }
          return prev - 1;
        });
        
        // Count overtime for focus sessions
        if (mode === 'focus' && timeLeft === 0) {
          setOvertimeSeconds(prev => prev + 1);
        }
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode]);
  
  const playCompletionSound = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjKF0fPTgjMGHm7A7+OZURE=');
    }
    audioRef.current.play().catch(() => {});
  };
  
  const handleStartSession = () => {
    if (!selectedTaskId) {
      toast.error('Please select a task first');
      return;
    }
    
    sessionStartRef.current = new Date();
    setIsRunning(true);
    setShowTaskPrompt(false);
    toast.success('Focus session started!');
  };
  
  const handleFinishTask = () => {
    if (sessionStartRef.current && selectedTaskId) {
      const actualDuration = focusDuration * 60 + overtimeSeconds;
      
      addSession({
        taskId: selectedTaskId,
        startTime: sessionStartRef.current,
        endTime: new Date(),
        duration: actualDuration,
        breaksCount: 0,
      });
      
      const task = tasks.find(t => t.id === selectedTaskId);
      if (task) {
        updateTask(selectedTaskId, {
          timeSpent: task.timeSpent + actualDuration,
        });
      }
      
      toast.success('Task session saved!');
    }
    
    setShowTimeUpPrompt(false);
    setIsRunning(false);
    setOvertimeSeconds(0);
    setTimeLeft(focusDuration * 60);
  };
  
  const handleContinueTask = () => {
    setShowTimeUpPrompt(false);
    // Keep counting in overtime
  };
  
  const handleSwitchToBreak = () => {
    handleFinishTask();
    setMode('break');
    setShowTaskPrompt(false);
  };
  
  const handlePlayPause = () => {
    setIsRunning(!isRunning);
  };
  
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'focus' ? focusDuration * 60 : breakDuration * 60);
    setOvertimeSeconds(0);
    setShowTimeUpPrompt(false);
  };
  
  const handleSaveSettings = () => {
    setFocusDuration(tempFocusDuration);
    setBreakDuration(tempBreakDuration);
    setShowSettings(false);
    toast.success('Settings saved!');
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const progress = timeLeft > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 100;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-card/95 backdrop-blur-sm border-sidebar-border">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{mode === 'focus' ? 'Focus Session' : 'Break Time'}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        {showSettings ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Focus Duration: {tempFocusDuration} minutes</label>
              <Slider
                value={[tempFocusDuration]}
                onValueChange={([value]) => setTempFocusDuration(value)}
                min={15}
                max={90}
                step={5}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Break Duration: {tempBreakDuration} minutes</label>
              <Slider
                value={[tempBreakDuration]}
                onValueChange={([value]) => setTempBreakDuration(value)}
                min={5}
                max={30}
                step={5}
              />
            </div>
            
            <Button onClick={handleSaveSettings} className="w-full">
              Save Settings
            </Button>
          </div>
        ) : showTaskPrompt && mode === 'focus' ? (
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">Select a task to focus on:</p>
            
            <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a task..." />
              </SelectTrigger>
              <SelectContent>
                {activeTasks.map(task => (
                  <SelectItem key={task.id} value={task.id}>
                    {task.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {activeTasks.length === 0 && (
              <p className="text-xs text-muted-foreground text-center">
                No active tasks. Create a task first!
              </p>
            )}
            
            <Button
              onClick={handleStartSession}
              disabled={!selectedTaskId}
              className="w-full"
            >
              Start Focus Session
            </Button>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="text-center">
              <div className="text-6xl font-bold text-black mb-2">
                {formatTime(timeLeft)}
              </div>
              {overtimeSeconds > 0 && (
                <p className="text-sm text-muted-foreground">
                  +{formatTime(overtimeSeconds)} overtime
                </p>
              )}
              
              <div className="space-y-2 mt-4">
                <Slider
                  value={[progress]}
                  max={100}
                  step={0.1}
                  className="cursor-default"
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  {Math.round(progress)}% complete
                </p>
              </div>
            </div>
            
            {showTimeUpPrompt && (
              <Card className="p-4 bg-yellow-50 border-yellow-200">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-3 flex-1">
                    <p className="text-sm font-medium">Time's up!</p>
                    <p className="text-xs text-muted-foreground">
                      Have you finished the task?
                    </p>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleFinishTask}
                        size="sm"
                        className="flex-1"
                      >
                        Finish Task
                      </Button>
                      <Button
                        onClick={handleContinueTask}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        Continue
                      </Button>
                    </div>
                    <Button
                      onClick={handleSwitchToBreak}
                      variant="secondary"
                      size="sm"
                      className="w-full"
                    >
                      Take a Break
                    </Button>
                  </div>
                </div>
              </Card>
            )}
            
            {showBreakWarning && (
              <Card className="p-3 bg-orange-50 border-orange-200">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-600" />
                  <p className="text-sm">Break ending soon!</p>
                </div>
              </Card>
            )}
            
            <div className="flex gap-2">
              <Button
                onClick={handlePlayPause}
                className="flex-1"
                size="lg"
                disabled={showTaskPrompt}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Resume
                  </>
                )}
              </Button>
              
              <Button
                onClick={handleReset}
                variant="outline"
                size="lg"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-2 pt-4 border-t border-sidebar-border">
              <button
                onClick={() => {
                  setMode('focus');
                  setShowTaskPrompt(true);
                  setIsRunning(false);
                }}
                className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  mode === 'focus'
                    ? 'bg-primary text-white'
                    : 'bg-input-background text-black hover:bg-accent'
                }`}
              >
                Focus ({focusDuration}m)
              </button>
              <button
                onClick={() => {
                  setMode('break');
                  setShowTaskPrompt(false);
                  setIsRunning(false);
                }}
                className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  mode === 'break'
                    ? 'bg-primary text-white'
                    : 'bg-input-background text-black hover:bg-accent'
                }`}
              >
                Break ({breakDuration}m)
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
