import { useMemo } from 'react';
import { useAppStore } from '../../stores/useAppStore';
import { DraggableModal } from './DraggableModal';
import { Flame, Clock, CheckCircle, Target } from 'lucide-react';

interface ProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOffset?: { x: number; y: number };
}

function calcStreak(sessions: ReturnType<typeof useAppStore.getState>['sessions']): number {
  if (!sessions.length) return 0;
  const days = new Set(sessions.map(s => new Date(s.startTime).toDateString()));
  let streak = 0;
  const d = new Date();
  while (days.has(d.toDateString())) { streak++; d.setDate(d.getDate() - 1); }
  return streak;
}

export function ProgressModal({ isOpen, onClose, initialOffset }: ProgressModalProps) {
  const { tasks, sessions } = useAppStore();
  const today = new Date().toDateString();

  const todayMinutes = useMemo(() =>
    sessions.filter(s => new Date(s.startTime).toDateString() === today)
      .reduce((acc, s) => acc + Math.floor(s.duration / 60), 0),
    [sessions, today]);

  const todaySessions = useMemo(() =>
    sessions.filter(s => new Date(s.startTime).toDateString() === today).length,
    [sessions, today]);

  const todayCompleted = useMemo(() =>
    tasks.filter(t => t.completed).length,
    [tasks]);

  const streak = useMemo(() => calcStreak(sessions), [sessions]);

  // All parent tasks (tasks that have at least one subtask)
  const parentTasks = useMemo(() =>
    tasks.filter(t => !t.parentId && tasks.some(s => s.parentId === t.id)),
    [tasks]);

  const parentProgress = useMemo(() =>
    parentTasks.map(p => {
      const subs = tasks.filter(t => t.parentId === p.id);
      const done = subs.filter(t => t.completed).length;
      const pct = subs.length > 0 ? Math.round((done / subs.length) * 100) : 0;
      return { ...p, done, total: subs.length, pct };
    }),
    [parentTasks, tasks]);

  return (
    <DraggableModal
      isOpen={isOpen}
      onClose={onClose}
      initialOffset={initialOffset}
      minWidth={260}
      minHeight={200}
      style={{ width: 300 }}
    >
      <h2 className="text-sm font-semibold leading-none mb-4">Progress</h2>

      <div className="space-y-3">
        {/* Today stats row */}
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center p-2 rounded-lg bg-blue-500/10">
            <Clock className="w-3.5 h-3.5 text-blue-500 mb-1" />
            <p className="text-sm font-bold leading-none">{todayMinutes}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">min focus</p>
          </div>
          <div className="flex flex-col items-center p-2 rounded-lg bg-orange-500/10">
            <Flame className="w-3.5 h-3.5 text-orange-500 mb-1" />
            <p className="text-sm font-bold leading-none">{streak}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">day streak</p>
          </div>
          <div className="flex flex-col items-center p-2 rounded-lg bg-green-500/10">
            <CheckCircle className="w-3.5 h-3.5 text-green-500 mb-1" />
            <p className="text-sm font-bold leading-none">{todayCompleted}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">done</p>
          </div>
        </div>

        {/* All parent task progress */}
        {parentProgress.length > 0 && (
          <div className="pt-2 border-t border-border space-y-2.5">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide flex items-center gap-1">
              <Target className="w-3 h-3" /> Goals
            </p>
            {parentProgress.map(p => (
              <div key={p.id} className={p.completed ? 'opacity-50' : ''}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-medium truncate flex-1 mr-2">{p.title}</p>
                  <span className="text-[10px] text-muted-foreground shrink-0">{p.done}/{p.total}</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${p.completed ? 'bg-green-500' : 'bg-primary'}`}
                    style={{ width: `${p.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DraggableModal>
  );
}
