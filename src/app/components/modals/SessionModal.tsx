import { useState, useEffect, useRef, useCallback } from 'react';
import { useAppStore } from '../../stores/useAppStore';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import { Play, Pause, Coffee, Plus, X } from 'lucide-react';
import { DraggableModal } from './DraggableModal';

interface SessionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Phase = 'task-select' | 'focus' | 'time-up' | 'break' | 'break-warning' | 'next-task';

export function SessionModal({ isOpen, onClose }: SessionModalProps) {
  const {
    tasks, focusDuration, breakDuration,
    setFocusDuration, setBreakDuration,
    updateTask, addSession, addTask, startTimer, stopTimer,
  } = useAppStore();

  // local slider state — applied on Start, not saved separately
  const [localFocus, setLocalFocus] = useState(focusDuration);
  const [localBreak, setLocalBreak] = useState(breakDuration);

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

  useEffect(() => {
    if (phase === 'focus') { setTimeLeft(localFocus * 60); setOvertime(0); }
    else if (phase === 'break') { setTimeLeft(localBreak * 60); setOvertime(0); }
  }, [phase, localFocus, localBreak]);

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      const p = phaseRef.current;
      const tl = timeLeftRef.current;

      if (p === 'focus') {
        if (tl > 0) { setTimeLeft(t => t - 1); }
        else {
          setOvertime(o => o + 1);
          if (overtimeRef.current === 0) { playSound(); setPhase('time-up'); }
        }
      } else if (p === 'time-up') {
        setOvertime(o => o + 1);
      } else if (p === 'break' || p === 'break-warning') {
        const warnAt = localBreak < 10
          ? Math.floor(localBreak * 60 * 0.5)
          : 5 * 60;
        if (p === 'break' && tl > warnAt && tl - 1 === warnAt) {
          setPhase('break-warning');
          toast.warning(`Break ending in ${warnAt >= 60 ? `${warnAt / 60} min` : `${warnAt}s`} — get ready!`);
        }
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
  }, [isRunning, playSound, localBreak]);

  const saveSession = useCallback((taskId: string, durationSecs: number) => {
    if (!sessionStartRef.current || !taskId) return;
    addSession({ taskId, startTime: sessionStartRef.current, endTime: new Date(), duration: durationSecs, breaksCount: 0 });
    const task = tasks.find(t => t.id === taskId);
    if (task) updateTask(taskId, { timeSpent: task.timeSpent + durationSecs });
  }, [tasks, addSession, updateTask]);

  const handleStart = () => {
    if (!selectedTaskId) { toast.error('Pick a task first'); return; }
    // commit slider values to store on start
    setFocusDuration(localFocus);
    setBreakDuration(localBreak);
    sessionStartRef.current = new Date();
    startTimer(selectedTaskId);
    setIsRunning(true);
    setPhase('focus');
  };

  const handleFinishAndBreak = () => {
    saveSession(selectedTaskId, localFocus * 60 + overtime);
    toast.success('Session saved! Enjoy your break.');
    setIsRunning(true);
    setPhase('break');
  };

  const handleFinishNoBreak = () => {
    saveSession(selectedTaskId, localFocus * 60 + overtime);
    toast.success('Session saved!');
    setIsRunning(false);
    stopTimer();
    setPhase('task-select');
  };

  const handleStartNextTask = (taskId: string) => {
    setSelectedTaskId(taskId);
    setPhase('task-select');
  };

  const handleQuickAdd = () => {
    if (!newTaskTitle.trim()) return;
    addTask({ title: newTaskTitle.trim(), priority: 'medium', estimatedMinutes: localFocus });
    setNewTaskTitle('');
    setShowQuickAdd(false);
    toast.success('Task added!');
  };

  const handleReset = () => {
    setIsRunning(false);
    stopTimer();
    setPhase('task-select');
    setOvertime(0);
    setTimeLeft(localFocus * 60);
  };

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  // remaining ratio 1→0: bar starts full, shrinks from the right, grey when done
  const focusRemaining = localFocus * 60 > 0
    ? Math.max(0, timeLeft / (localFocus * 60))
    : 0;
  const breakRemaining = localBreak * 60 > 0
    ? Math.max(0, timeLeft / (localBreak * 60))
    : 0;

  const isFocusPhase = phase === 'focus' || phase === 'time-up';
  const isBreakPhase = phase === 'break' || phase === 'break-warning';

  return (
    <DraggableModal isOpen={isOpen} onClose={() => { handleReset(); onClose(); }} className="max-w-sm">
      <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-base">
            <span>
              {phase === 'task-select' ? 'Session' :
               isFocusPhase ? '🧠 Focus' :
               isBreakPhase ? '☕ Break' :
               'Break Over'}
            </span>
            {(isFocusPhase || isBreakPhase) && (
              <Button variant="ghost" size="sm" onClick={handleReset} title="End session">
                <X className="w-4 h-4" />
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>

        {/* ── Task select (always shows sliders) ── */}
        {phase === 'task-select' && (
          <div className="space-y-4 py-2">

            {/* Duration sliders — always visible, no save needed */}
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium">Focus</span>
                  <span className="text-muted-foreground">{localFocus} min</span>
                </div>
                <Slider value={[localFocus]} onValueChange={([v]) => setLocalFocus(v)} min={1} max={60} step={1} />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium">Break</span>
                  <span className="text-muted-foreground">{localBreak} min</span>
                </div>
                <Slider value={[localBreak]} onValueChange={([v]) => setLocalBreak(v)} min={1} max={20} step={1} />
              </div>
            </div>

            <div className="border-t border-sidebar-border pt-3 space-y-2">
              <p className="text-xs text-muted-foreground">What are you working on?</p>
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
                  <Input autoFocus placeholder="Task name…" value={newTaskTitle}
                    onChange={e => setNewTaskTitle(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleQuickAdd()} />
                  <Button size="sm" onClick={handleQuickAdd}><Plus className="w-4 h-4" /></Button>
                </div>
              ) : (
                <button onClick={() => setShowQuickAdd(true)}
                  className="text-xs text-primary hover:underline underline-offset-2">
                  + Quick add task
                </button>
              )}
            </div>

            <Button onClick={handleStart} disabled={!selectedTaskId} className="w-full" size="lg">
              <Play className="w-4 h-4 mr-2" /> Start Focus Session
            </Button>
          </div>
        )}

        {/* ── Focus running ── */}
        {isFocusPhase && (
          <div className="space-y-4 py-2">
            {currentTask && (
              <p className="text-xs text-muted-foreground truncate">📌 {currentTask.title}</p>
            )}

            <div className="text-center">
              <div className="text-6xl font-bold tabular-nums">
                {overtime > 0 ? fmt(overtime) : fmt(timeLeft)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {overtime > 0 ? 'overtime' : 'remaining'}
              </p>
              {/* grey overlay grows left→right over the colored base */}
              <div className="mt-3 h-2 rounded-full bg-primary overflow-hidden">
                <div
                  className="h-full rounded-full bg-muted transition-all duration-1000"
                  style={{ width: `${(1 - focusRemaining) * 100}%` }}
                />
              </div>
            </div>

            {phase === 'time-up' ? (
              <div className="space-y-2">
                <p className="text-sm font-medium text-center">Time's up — finished the task?</p>
                <Button className="w-full" onClick={handleFinishAndBreak}>
                  <Coffee className="w-4 h-4 mr-2" /> Done — take a break
                </Button>
                <Button className="w-full" variant="ghost" size="sm" onClick={handleFinishNoBreak}>
                  Done, skip break
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button onClick={() => setIsRunning(r => !r)} className="flex-1" size="lg">
                  {isRunning
                    ? <><Pause className="w-4 h-4 mr-2" />Pause</>
                    : <><Play className="w-4 h-4 mr-2" />Resume</>}
                </Button>
                <Button variant="ghost" size="lg" onClick={handleFinishAndBreak} title="Take a break early">
                  <Coffee className="w-4 h-4 text-muted-foreground" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* ── Break ── */}
        {isBreakPhase && (
          <div className="space-y-4 py-2">
            <div className="text-center">
              <div className={`text-5xl font-bold tabular-nums ${phase === 'break-warning' ? 'text-orange-500 animate-pulse' : ''}`}>
                {fmt(timeLeft)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">break remaining</p>
              <div className={`mt-3 h-2 rounded-full overflow-hidden ${phase === 'break-warning' ? 'bg-orange-400' : 'bg-green-400'}`}>
                <div
                  className="h-full rounded-full bg-muted transition-all duration-1000"
                  style={{ width: `${(1 - breakRemaining) * 100}%` }}
                />
              </div>
            </div>

            {/* Regular break: rest suggestions */}
            {phase === 'break' && (
              <>
                <div className="text-center text-sm text-muted-foreground space-y-0.5">
                  <p>💧 Drink some water</p>
                  <p> Rest your eyes</p>
                  <p>🧘 Stretch a little</p>
                </div>
                <Button variant="outline" className="w-full"
                  onClick={() => { setIsRunning(false); setPhase('next-task'); }}>
                  End break early
                </Button>
              </>
            )}

            {/* Warning: swap suggestions for next-task picker */}
            {phase === 'break-warning' && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-orange-700 text-center">Almost time — pick your next task</p>

                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {currentTask && (
                    <button onClick={() => handleStartNextTask(currentTask.id)}
                      className="w-full text-left px-3 py-2 rounded-md border border-primary/30 bg-primary/5 hover:bg-primary/10 text-sm transition-colors flex items-center justify-between group">
                      <span className="truncate">↩ Continue: {currentTask.title}</span>
                      <Play className="w-3 h-3 opacity-0 group-hover:opacity-100 shrink-0 ml-2 text-primary" />
                    </button>
                  )}
                  {activeTasks.filter(t => t.id !== selectedTaskId).map(t => (
                    <button key={t.id} onClick={() => handleStartNextTask(t.id)}
                      className="w-full text-left px-3 py-2 rounded-md bg-accent/50 hover:bg-accent text-sm transition-colors flex items-center justify-between group">
                      <span className="truncate">{t.title}</span>
                      <Play className="w-3 h-3 opacity-0 group-hover:opacity-100 shrink-0 ml-2" />
                    </button>
                  ))}
                  {activeTasks.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-2">All tasks done! 🎉</p>
                  )}
                </div>

                {showQuickAdd ? (
                  <div className="flex gap-2">
                    <Input autoFocus placeholder="New task…" value={newTaskTitle}
                      onChange={e => setNewTaskTitle(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleQuickAdd()} />
                    <Button size="sm" onClick={handleQuickAdd}><Plus className="w-4 h-4" /></Button>
                  </div>
                ) : (
                  <button onClick={() => setShowQuickAdd(true)}
                    className="text-xs text-primary hover:underline underline-offset-2">
                    + Add a task
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Break Over — teammate's re-engagement card ── */}
        {phase === 'next-task' && (
          <div className="space-y-4 py-2">
            {/* Bold "BREAK OVER" hero matching teammate's design */}
            <div className="rounded-lg bg-[rgba(161,161,161,0.15)] border border-sidebar-border p-4 text-center relative overflow-hidden">
              <p
                className="text-4xl font-bold leading-tight"
                style={{
                  fontFamily: 'Lato, sans-serif',
                  textShadow: '0px 4px 4px rgba(0,0,0,0.25)',
                }}
              >
                BREAK<br />OVER
              </p>
            </div>

            {/* Continue current task — most prominent */}
            {currentTask && (
              <Button className="w-full" size="lg" onClick={() => handleStartNextTask(currentTask.id)}>
                <Play className="w-4 h-4 mr-2" /> Start Next Focus Session
              </Button>
            )}

            {/* Switch task */}
            {activeTasks.filter(t => t.id !== selectedTaskId).length > 0 && (
              <div className="space-y-1.5">
                <p className="text-xs text-muted-foreground">Or switch to:</p>
                <div className="space-y-1 max-h-36 overflow-y-auto">
                  {activeTasks.filter(t => t.id !== selectedTaskId).map(t => (
                    <button key={t.id} onClick={() => handleStartNextTask(t.id)}
                      className="w-full text-left px-3 py-2 rounded-md bg-accent/50 hover:bg-accent text-sm transition-colors flex items-center justify-between group">
                      <span className="truncate">{t.title}</span>
                      <Play className="w-3 h-3 opacity-0 group-hover:opacity-100 shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {showQuickAdd ? (
              <div className="flex gap-2">
                <Input autoFocus placeholder="New task…" value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleQuickAdd()} />
                <Button size="sm" onClick={handleQuickAdd}><Plus className="w-4 h-4" /></Button>
              </div>
            ) : (
              <button onClick={() => setShowQuickAdd(true)}
                className="text-xs text-primary hover:underline underline-offset-2">
                + Add a task
              </button>
            )}

            <Button variant="ghost" className="w-full text-xs text-muted-foreground" onClick={handleReset}>
              End session
            </Button>
          </div>
        )}

      </DraggableModal>
  );
}
