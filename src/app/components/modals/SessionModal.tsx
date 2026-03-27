import { useState, useEffect, useRef, useCallback } from 'react';
import { useAppStore } from '../../stores/useAppStore';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import { Play, Pause, RotateCcw, Settings, AlertCircle, Coffee, Plus } from 'lucide-react';

interface SessionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Phase = 'task-select' | 'focus' | 'time-up' | 'break' | 'break-warning' | 'next-task';

export function SessionModal({ isOpen, onClose }: SessionModalProps) {
  const { tasks, focusDuration, breakDuration, setFocusDuration, setBreakDuration, updateTask, addSession, addTask, startTimer, stopTimer } = useAppStore();

  const [showSettings, setShowSettings] = useState(false);
  const [tempFocus, setTempFocus] = useState(focusDuration);
  const [tempBreak, setTempBreak] = useState(breakDuration);

  const [phase, setPhase] = useState<Phase>('task-select');
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [timeLeft, setTimeLeft] = useState(focusDuration * 60);
  const [overtime, setOvertime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const sessionStartRef = useRef<Date | null>(null);
  const phaseRef = useRef(phase);
  const timeLeftRef = useRef(timeLeft);
  const overtimeRef = useRef(overtime);
  phaseRef.current = phase;
  timeLeftRef.current = timeLeft;
  overtimeRef.current = overtime;

  const activeTasks = tasks.filter(t => !t.completed);
  const currentTask = tasks.find(t => t.id === selectedTaskId);

  const playSound = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.8);
    } catch {}
  }, []);

  // Reset timer when phase changes
  useEffect(() => {
    if (phase === 'focus') {
      setTimeLeft(focusDuration * 60);
      setOvertime(0);
    } else if (phase === 'break') {
      setTimeLeft(breakDuration * 60);
      setOvertime(0);
    }
  }, [phase, focusDuration, breakDuration]);

  // Main tick
  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      const p = phaseRef.current;
      const tl = timeLeftRef.current;

      if (p === 'focus') {
        if (tl > 0) {
          setTimeLeft(t => t - 1);
        } else {
          // time's up — keep counting overtime
          setOvertime(o => o + 1);
          if (overtimeRef.current === 0) {
            playSound();
            setPhase('time-up');
          }
        }
      } else if (p === 'time-up') {
        setOvertime(o => o + 1);
      } else if (p === 'break') {
        if (tl > 60 && tl - 1 === 60) {
          setPhase('break-warning');
          toast.warning('Break ending in 1 minute — get ready!');
        }
        if (tl <= 1) {
          playSound();
          setIsRunning(false);
          setPhase('next-task');
        } else {
          setTimeLeft(t => t - 1);
        }
      } else if (p === 'break-warning') {
        if (tl <= 1) {
          playSound();
          setIsRunning(false);
          setPhase('next-task');
        } else {
          setTimeLeft(t => t - 1);
        }
      }
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning, playSound]);

  const saveSession = useCallback((taskId: string, durationSecs: number) => {
    if (!sessionStartRef.current || !taskId) return;
    addSession({ taskId, startTime: sessionStartRef.current, endTime: new Date(), duration: durationSecs, breaksCount: 0 });
    const task = tasks.find(t => t.id === taskId);
    if (task) updateTask(taskId, { timeSpent: task.timeSpent + durationSecs });
  }, [tasks, addSession, updateTask]);

  const handleStart = () => {
    if (!selectedTaskId) { toast.error('Pick a task first'); return; }
    sessionStartRef.current = new Date();
    startTimer(selectedTaskId);
    setIsRunning(true);
    setPhase('focus');
  };

  const handleFinishAndBreak = () => {
    saveSession(selectedTaskId, focusDuration * 60 + overtime);
    toast.success('Session saved! Enjoy your break.');
    setIsRunning(true);
    setPhase('break');
  };

  const handleContinue = () => {
    setPhase('time-up'); // stay in overtime
  };

  const handleFinishNoBreak = () => {
    saveSession(selectedTaskId, focusDuration * 60 + overtime);
    toast.success('Session saved!');
    setIsRunning(false);
    setPhase('task-select');
  };

  const handleStartNextTask = (taskId: string) => {
    setSelectedTaskId(taskId);
    sessionStartRef.current = new Date();
    startTimer(taskId);
    setIsRunning(true);
    setPhase('focus');
  };

  const handleQuickAdd = () => {
    if (!newTaskTitle.trim()) return;
    addTask({ title: newTaskTitle.trim(), priority: 'medium', estimatedMinutes: focusDuration });
    setNewTaskTitle('');
    setShowQuickAdd(false);
    toast.success('Task added!');
  };

  const handleReset = () => {
    setIsRunning(false);
    stopTimer();
    setPhase('task-select');
    setOvertime(0);
    setTimeLeft(focusDuration * 60);
  };

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const focusTotal = focusDuration * 60;
  const breakTotal = breakDuration * 60;
  const focusProgress = phase === 'focus' ? Math.round(((focusTotal - timeLeft) / focusTotal) * 100) : 100;
  const breakProgress = (phase === 'break' || phase === 'break-warning') ? Math.round(((breakTotal - timeLeft) / breakTotal) * 100) : 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { handleReset(); onClose(); } }}>
      <DialogContent className="max-w-sm bg-card/95 backdrop-blur-sm border-sidebar-border">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-base">
            <span>
              {phase === 'task-select' ? 'Start a Session' :
               phase === 'focus' || phase === 'time-up' ? '🧠 Focus' :
               phase === 'break' || phase === 'break-warning' ? '☕ Break' :
               '🎯 Next Task'}
            </span>
            <div className="flex gap-1">
              {(phase === 'task-select') && (
                <Button variant="ghost" size="sm" onClick={() => setShowSettings(s => !s)}>
                  <Settings className="w-4 h-4" />
                </Button>
              )}
              {(phase === 'focus' || phase === 'time-up') && (
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Settings panel */}
        {showSettings && phase === 'task-select' && (
          <div className="space-y-4 py-2 border-b border-sidebar-border mb-2">
            <div className="space-y-1">
              <label className="text-sm font-medium">Focus: {tempFocus} min</label>
              <Slider value={[tempFocus]} onValueChange={([v]) => setTempFocus(v)} min={15} max={90} step={5} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Break: {tempBreak} min</label>
              <Slider value={[tempBreak]} onValueChange={([v]) => setTempBreak(v)} min={5} max={30} step={5} />
            </div>
            <Button size="sm" className="w-full" onClick={() => { setFocusDuration(tempFocus); setBreakDuration(tempBreak); setShowSettings(false); toast.success('Saved!'); }}>
              Save
            </Button>
          </div>
        )}

        {/* Task select */}
        {phase === 'task-select' && (
          <div className="space-y-3 py-2">
            <p className="text-sm text-muted-foreground">What are you working on?</p>
            <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
              <SelectTrigger><SelectValue placeholder="Choose a task…" /></SelectTrigger>
              <SelectContent>
                {activeTasks.map(t => (
                  <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {showQuickAdd ? (
              <div className="flex gap-2">
                <Input autoFocus placeholder="Task name…" value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleQuickAdd()} />
                <Button size="sm" onClick={handleQuickAdd}><Plus className="w-4 h-4" /></Button>
              </div>
            ) : (
              <button onClick={() => setShowQuickAdd(true)} className="text-xs text-primary underline-offset-2 hover:underline">+ Quick add task</button>
            )}

            <div className="text-xs text-muted-foreground flex gap-3">
              <span>Focus: {focusDuration}m</span>
              <span>Break: {breakDuration}m</span>
            </div>

            <Button onClick={handleStart} disabled={!selectedTaskId} className="w-full" size="lg">
              <Play className="w-4 h-4 mr-2" /> Start Focus Session
            </Button>
          </div>
        )}

        {/* Focus running */}
        {(phase === 'focus' || phase === 'time-up') && (
          <div className="space-y-4 py-2">
            {currentTask && <p className="text-xs text-muted-foreground truncate">📌 {currentTask.title}</p>}

            <div className="text-center">
              <div className="text-6xl font-bold tabular-nums">{fmt(timeLeft)}</div>
              {overtime > 0 && <p className="text-sm text-primary mt-1">+{fmt(overtime)} overtime</p>}
              <div className="mt-3 space-y-1">
                <Slider value={[focusProgress]} max={100} disabled className="cursor-default" />
                <p className="text-xs text-muted-foreground">{focusProgress}% of planned time</p>
              </div>
            </div>

            {phase === 'time-up' && (
              <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600 shrink-0" />
                  <p className="text-sm font-medium text-yellow-800">Time's up — finished the task?</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" onClick={handleFinishAndBreak}><Coffee className="w-3 h-3 mr-1" />Done, take break</Button>
                  <Button size="sm" variant="outline" onClick={handleContinue}>Keep going</Button>
                </div>
                <Button size="sm" variant="ghost" className="w-full text-xs" onClick={handleFinishNoBreak}>Done, no break</Button>
              </div>
            )}

            {phase === 'focus' && (
              <div className="flex gap-2">
                <Button onClick={() => setIsRunning(r => !r)} className="flex-1" size="lg">
                  {isRunning ? <><Pause className="w-4 h-4 mr-2" />Pause</> : <><Play className="w-4 h-4 mr-2" />Resume</>}
                </Button>
                <Button variant="outline" size="lg" onClick={() => { setPhase('time-up'); setIsRunning(true); }}>
                  <Coffee className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Break */}
        {(phase === 'break' || phase === 'break-warning') && (
          <div className="space-y-4 py-2">
            <div className="text-center">
              <div className="text-5xl font-bold tabular-nums">{fmt(timeLeft)}</div>
              <p className="text-sm text-muted-foreground mt-1">break remaining</p>
              <div className="mt-3 space-y-1">
                <Slider value={[breakProgress]} max={100} disabled className="cursor-default" />
              </div>
            </div>

            {phase === 'break-warning' && (
              <div className="rounded-lg bg-orange-50 border border-orange-200 p-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-600 shrink-0" />
                <p className="text-sm text-orange-800">Break ending soon — start wrapping up!</p>
              </div>
            )}

            <div className="text-center text-sm text-muted-foreground space-y-1">
              <p>💧 Drink some water</p>
              <p>👀 Rest your eyes</p>
              <p>🧘 Stretch a little</p>
            </div>

            <Button variant="outline" className="w-full" onClick={() => { setIsRunning(false); setPhase('next-task'); }}>
              End break early
            </Button>
          </div>
        )}

        {/* Next task prompt */}
        {phase === 'next-task' && (
          <div className="space-y-3 py-2">
            <p className="text-sm font-medium">Break's over — what's next?</p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {activeTasks.map(t => (
                <button key={t.id} onClick={() => handleStartNextTask(t.id)}
                  className="w-full text-left px-3 py-2 rounded-md bg-accent/50 hover:bg-accent text-sm transition-colors flex items-center justify-between group">
                  <span className="truncate">{t.title}</span>
                  <Play className="w-3 h-3 opacity-0 group-hover:opacity-100 shrink-0 ml-2" />
                </button>
              ))}
              {activeTasks.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">All tasks done! 🎉</p>}
            </div>
            {showQuickAdd ? (
              <div className="flex gap-2">
                <Input autoFocus placeholder="New task…" value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleQuickAdd()} />
                <Button size="sm" onClick={handleQuickAdd}><Plus className="w-4 h-4" /></Button>
              </div>
            ) : (
              <button onClick={() => setShowQuickAdd(true)} className="text-xs text-primary underline-offset-2 hover:underline">+ Add a task</button>
            )}
            <Button variant="ghost" className="w-full text-xs" onClick={handleReset}>End session</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
