import { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../stores/useAppStore';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Slider } from './ui/slider';
import { toast } from 'sonner';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface FocusTimerProps {
  taskId?: string;
  onComplete?: () => void;
}

export function FocusTimer({ taskId, onComplete }: FocusTimerProps) {
  const {
    isTimerActive,
    timerMode,
    focusDuration,
    breakDuration,
    startTimer,
    stopTimer,
    setTimerMode,
    updateTask,
    addSession,
    tasks,
  } = useAppStore();
  
  const totalDuration = timerMode === 'focus' ? focusDuration * 60 : breakDuration * 60;
  const [timeLeft, setTimeLeft] = useState(totalDuration);
  const [isPaused, setIsPaused] = useState(true);
  const sessionStartRef = useRef<Date | null>(null);
  const breaksCountRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTask = taskId ? tasks.find(t => t.id === taskId) : null;
  
  useEffect(() => {
    const newDuration = timerMode === 'focus' ? focusDuration * 60 : breakDuration * 60;
    setTimeLeft(newDuration);
    setIsPaused(true);
  }, [timerMode, focusDuration, breakDuration]);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerActive && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isTimerActive, isPaused, timeLeft]);
  
  const handleTimerComplete = () => {
    playCompletionSound();
    
    if (timerMode === 'focus') {
      // Save session
      if (sessionStartRef.current) {
        addSession({
          taskId: taskId,
          startTime: sessionStartRef.current,
          endTime: new Date(),
          duration: focusDuration * 60,
          breaksCount: breaksCountRef.current,
        });
      }
      
      // Update task time
      if (taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
          updateTask(taskId, {
            timeSpent: task.timeSpent + focusDuration * 60,
          });
        }
      }
      
      toast.success('Focus session complete! Time for a break.');
      breaksCountRef.current++;
      onComplete?.();
    } else {
      toast.success('Break complete! Ready to focus again?');
      setTimerMode('focus');
      sessionStartRef.current = new Date();
    }
    
    setIsPaused(true);
    stopTimer();
  };
  
  const playCompletionSound = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjKF0fPTgjMGHm7A7+OZURE=');
    }
    audioRef.current.play().catch(() => {});
  };
  
  const handlePlayPause = () => {
    if (!isTimerActive || isPaused) {
      startTimer(taskId);
      sessionStartRef.current = new Date();
      breaksCountRef.current = 0;
      setIsPaused(false);
    } else {
      setIsPaused(true);
      stopTimer();
    }
  };
  
  const handleReset = () => {
    const newDuration = timerMode === 'focus' ? focusDuration * 60 : breakDuration * 60;
    setTimeLeft(newDuration);
    setIsPaused(true);
    stopTimer();
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const progress = ((totalDuration - timeLeft) / totalDuration) * 100;
  
  return (
    <Card className="border-sidebar-border bg-card/80 backdrop-blur-sm p-6">
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">
            {timerMode === 'focus' ? 'Focus Session' : 'Break Time'}
          </h3>
          {currentTask && (
            <p className="text-xs text-muted-foreground truncate">
              {currentTask.title}
            </p>
          )}
        </div>
        
        <div className="text-center">
          <div className="text-6xl font-bold text-black mb-4">
            {formatTime(timeLeft)}
          </div>
          
          <div className="space-y-2">
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
        
        <div className="flex gap-2">
          <Button
            onClick={handlePlayPause}
            className="flex-1"
            size="lg"
          >
            {isPaused ? (
              <>
                <Play className="w-5 h-5 mr-2" />
                Start
              </>
            ) : (
              <>
                <Pause className="w-5 h-5 mr-2" />
                Pause
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
            onClick={() => setTimerMode('focus')}
            className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              timerMode === 'focus'
                ? 'bg-primary text-white'
                : 'bg-input-background text-black hover:bg-accent'
            }`}
          >
            Focus ({focusDuration}m)
          </button>
          <button
            onClick={() => setTimerMode('break')}
            className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              timerMode === 'break'
                ? 'bg-primary text-white'
                : 'bg-input-background text-black hover:bg-accent'
            }`}
          >
            Break ({breakDuration}m)
          </button>
        </div>
      </div>
    </Card>
  );
}
