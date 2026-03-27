import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { useAppStore } from '../../stores/useAppStore';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Trash2, Clock, Calendar, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { DraggableModal } from './DraggableModal';

interface TasksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TasksModal({ isOpen, onClose }: TasksModalProps) {
  const { tasks, addTask, deleteTask, toggleTask } = useAppStore();
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [dueDate, setDueDate] = useState('');

  const handleAdd = () => {
    if (!title.trim()) return;
    addTask({ title: title.trim(), priority, estimatedMinutes: 25, dueDate: dueDate ? new Date(dueDate) : undefined });
    setTitle('');
    setDueDate('');
    setPriority('medium');
    toast.success('Task added!');
  };

  const sorted = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    const p = { high: 0, medium: 1, low: 2 };
    return p[a.priority] - p[b.priority];
  });

  const priorityColor = (p: string) =>
    p === 'high' ? 'bg-red-500/10 text-red-600 border-red-300' :
    p === 'medium' ? 'bg-yellow-500/10 text-yellow-700 border-yellow-300' :
    'bg-green-500/10 text-green-700 border-green-300';

  return (
    <DraggableModal isOpen={isOpen} onClose={onClose} className="max-w-md max-h-[80vh] flex flex-col">
      <DialogHeader>
        <DialogTitle>Tasks <span className="text-sm font-normal text-muted-foreground">({tasks.filter(t => !t.completed).length} active)</span></DialogTitle>
      </DialogHeader>

        <div className="space-y-2 pb-3 border-b border-sidebar-border">
          <div className="flex gap-2">
            <Input
              autoFocus
              placeholder="Add a task…"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              className="flex-1"
            />
            <Button size="sm" onClick={handleAdd} disabled={!title.trim()}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {title && (
            <div className="flex gap-2 items-center">
              <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
                <SelectTrigger className="h-7 text-xs w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="h-7 text-xs flex-1" />
            </div>
          )}
        </div>

        <div className="overflow-y-auto flex-1 space-y-1.5 py-1">
          {sorted.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-8">No tasks yet — add one above!</p>
          ) : sorted.map(task => (
            <div key={task.id} className={`flex items-start gap-2.5 p-2.5 rounded-md bg-accent/30 hover:bg-accent/50 transition-colors ${task.completed ? 'opacity-50' : ''}`}>
              <Checkbox checked={task.completed} onCheckedChange={() => toggleTask(task.id)} className="mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>{task.title}</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  <Badge variant="outline" className={`text-xs ${priorityColor(task.priority)}`}>{task.priority}</Badge>
                  {task.dueDate && (
                    <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                      <Calendar className="w-3 h-3" />{format(new Date(task.dueDate), 'MMM d')}
                    </span>
                  )}
                  {task.timeSpent > 0 && (
                    <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                      <Clock className="w-3 h-3" />{Math.floor(task.timeSpent / 60)}m
                    </span>
                  )}
                </div>
              </div>
              <button onClick={() => { deleteTask(task.id); toast.success('Deleted'); }} className="text-muted-foreground hover:text-destructive transition-colors p-0.5">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
    </DraggableModal>
  );
}
