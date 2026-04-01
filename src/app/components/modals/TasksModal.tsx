import { useState } from 'react';
import { useAppStore, Task } from '../../stores/useAppStore';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Trash2, Clock, Calendar, Plus, ChevronDown, ChevronRight, Pencil, Check, X } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { DraggableModal } from './DraggableModal';

interface TasksModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOffset?: { x: number; y: number };
}

const PRIORITY_COLOR = (p: string) =>
  p === 'high'   ? 'bg-red-500/10 text-red-600 border-red-300' :
  p === 'medium' ? 'bg-yellow-500/10 text-yellow-700 border-yellow-300' :
                   'bg-green-500/10 text-green-700 border-green-300';

export function TasksModal({ isOpen, onClose, initialOffset }: TasksModalProps) {
  const { tasks, addTask, deleteTask, toggleTask, updateTask } = useAppStore();

  // ── Add form state ──────────────────────────────────────────────────────
  const [title, setTitle]           = useState('');
  const [priority, setPriority]     = useState<'high' | 'medium' | 'low'>('medium');
  const [dueDate, setDueDate]       = useState('');
  const [parentId, setParentId]     = useState<string>('none');
  const [newParentTitle, setNewParentTitle] = useState('');
  const [showNewParent, setShowNewParent]   = useState(false);

  // ── Edit state ──────────────────────────────────────────────────────────
  const [editingId, setEditingId]     = useState<string | null>(null);
  const [editTitle, setEditTitle]     = useState('');
  const [editPriority, setEditPriority] = useState<'high' | 'medium' | 'low'>('medium');

  // ── Collapsed parent groups ─────────────────────────────────────────────
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const trueParents    = tasks.filter(t => tasks.some(s => s.parentId === t.id));
  const standalones    = tasks.filter(t => !t.parentId && !tasks.some(s => s.parentId === t.id));

  const handleAdd = () => {
    if (!title.trim()) return;
    // If user is creating a new parent inline, add it first
    let resolvedParentId: string | undefined;
    if (parentId === '__new__' && newParentTitle.trim()) {
      const newId = crypto.randomUUID();
      addTask({ title: newParentTitle.trim(), priority: 'medium', estimatedMinutes: 0, id: newId } as any);
      resolvedParentId = newId;
    } else if (parentId !== 'none') {
      resolvedParentId = parentId;
    }
    addTask({
      title: title.trim(),
      priority,
      estimatedMinutes: 25,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      parentId: resolvedParentId,
    });
    setTitle(''); setDueDate(''); setPriority('medium'); setParentId('none');
    setNewParentTitle(''); setShowNewParent(false);
    toast.success('Task added!');
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditPriority(task.priority);
  };

  const commitEdit = (id: string) => {
    if (!editTitle.trim()) return;
    updateTask(id, { title: editTitle.trim(), priority: editPriority });
    setEditingId(null);
  };

  const cancelEdit = () => setEditingId(null);

  const toggleCollapse = (id: string) =>
    setCollapsed(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const renderTask = (task: Task, isSubtask = false) => {
    const isEditing = editingId === task.id;
    return (
      <div
        key={task.id}
        className={`flex items-start gap-2 p-2 rounded-md transition-colors
          ${isSubtask ? 'ml-4 bg-accent/20' : 'bg-accent/30'}
          ${task.completed ? 'opacity-50' : ''}
          hover:bg-accent/50`}
      >
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => toggleTask(task.id)}
          className="mt-0.5 shrink-0"
        />
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-1.5">
              <Input
                autoFocus
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') commitEdit(task.id); if (e.key === 'Escape') cancelEdit(); }}
                className="h-6 text-xs py-0"
              />
              <div className="flex gap-1.5 items-center">
                <Select value={editPriority} onValueChange={(v: any) => setEditPriority(v)}>
                  <SelectTrigger className="h-6 text-xs w-24"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <button onClick={() => commitEdit(task.id)} className="text-green-600 hover:text-green-700">
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button onClick={cancelEdit} className="text-muted-foreground hover:text-foreground">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className={`text-xs leading-snug ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                {task.title}
              </p>
              <div className="flex flex-wrap gap-1 mt-0.5">
                <Badge variant="outline" className={`text-[10px] px-1 py-0 ${PRIORITY_COLOR(task.priority)}`}>
                  {task.priority}
                </Badge>
                {task.dueDate && (
                  <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                    <Calendar className="w-2.5 h-2.5" />{format(new Date(task.dueDate), 'MMM d')}
                  </span>
                )}
                {task.timeSpent > 0 && (
                  <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5" />{Math.floor(task.timeSpent / 60)}m
                  </span>
                )}
              </div>
            </>
          )}
        </div>
        {!isEditing && (
          <div className="flex gap-0.5 shrink-0">
            <button onClick={() => startEdit(task)} className="text-muted-foreground hover:text-foreground p-0.5">
              <Pencil className="w-3 h-3" />
            </button>
            <button onClick={() => { deleteTask(task.id); toast.success('Deleted'); }} className="text-muted-foreground hover:text-destructive p-0.5">
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    );
  };

  const activeCount = tasks.filter(t => !t.completed).length;

  return (
    <DraggableModal
      isOpen={isOpen}
      onClose={onClose}
      initialOffset={initialOffset}
      minWidth={300}
      minHeight={360}
      style={{ width: 340, height: 480 }}
    >
      <h2 className="text-sm font-semibold leading-none mb-3">
        Tasks <span className="font-normal text-muted-foreground">({tasks.filter(t => !t.completed).length} active)</span>
      </h2>

      {/* ── Add form ── */}
      <div className="space-y-1.5 pb-3 border-b border-border mb-3">
        <div className="flex gap-1.5">
          <Input
            placeholder="Add a task…"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            className="flex-1 h-7 text-xs"
          />
          <Button size="sm" onClick={handleAdd} disabled={!title.trim()} className="h-7 px-2">
            <Plus className="w-3.5 h-3.5" />
          </Button>
        </div>
        {title && (
          <div className="space-y-1.5">
            <div className="flex gap-1.5">
              <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
                <SelectTrigger className="h-6 text-xs w-24"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="h-6 text-xs flex-1" />
            </div>
            <Select value={parentId} onValueChange={v => { setParentId(v); setShowNewParent(v === '__new__'); }}>
              <SelectTrigger className="h-6 text-xs w-full"><SelectValue placeholder="Just this task" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Just this task</SelectItem>
                <SelectItem value="__new__">+ New goal…</SelectItem>
                {trueParents.map(p => (
                  <SelectItem key={p.id} value={p.id}>↳ {p.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {parentId === '__new__' && (
              <Input
                autoFocus
                placeholder="Goal name…"
                value={newParentTitle}
                onChange={e => setNewParentTitle(e.target.value)}
                className="h-6 text-xs w-full"
              />
            )}
          </div>
        )}
      </div>

      {/* ── Task list ── */}
      <div className="overflow-y-auto space-y-2" style={{ maxHeight: 260 }}>
        {tasks.length === 0 && (
          <p className="text-center text-muted-foreground text-xs py-6">No tasks yet — add one above!</p>
        )}

        {/* Parent tasks with their subtasks */}
        {trueParents.map(parent => {
          const subs = tasks.filter(t => t.parentId === parent.id);
          const doneSubs = subs.filter(t => t.completed).length;
          const isCollapsed = collapsed.has(parent.id);
          return (
            <div key={parent.id} className="space-y-1">
              {/* Parent header */}
              <div className={`flex items-center gap-1.5 p-2 rounded-md bg-accent/40 ${parent.completed ? 'opacity-50' : ''}`}>
                <button onClick={() => toggleCollapse(parent.id)} className="text-muted-foreground shrink-0">
                  {isCollapsed
                    ? <ChevronRight className="w-3.5 h-3.5" />
                    : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                <Checkbox checked={parent.completed} onCheckedChange={() => toggleTask(parent.id)} className="shrink-0" />
                <div className="flex-1 min-w-0">
                  {editingId === parent.id ? (
                    <div className="flex gap-1 items-center">
                      <Input autoFocus value={editTitle} onChange={e => setEditTitle(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') commitEdit(parent.id); if (e.key === 'Escape') cancelEdit(); }}
                        className="h-5 text-xs py-0 flex-1" />
                      <button onClick={() => commitEdit(parent.id)} className="text-green-600"><Check className="w-3 h-3" /></button>
                      <button onClick={cancelEdit} className="text-muted-foreground"><X className="w-3 h-3" /></button>
                    </div>
                  ) : (
                    <p className={`text-xs font-medium truncate ${parent.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {parent.title}
                    </p>
                  )}
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0">{doneSubs}/{subs.length}</span>
                {editingId !== parent.id && (
                  <div className="flex gap-0.5 shrink-0">
                    <button onClick={() => startEdit(parent)} className="text-muted-foreground hover:text-foreground p-0.5">
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button onClick={() => { deleteTask(parent.id); toast.success('Deleted'); }} className="text-muted-foreground hover:text-destructive p-0.5">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
              {/* Subtasks */}
              {!isCollapsed && subs.map(sub => renderTask(sub, true))}
            </div>
          );
        })}

        {/* Standalone tasks */}
        {standalones.length > 0 && (
          <div className="space-y-1">
            {trueParents.length > 0 && (
              <p className="text-[10px] text-muted-foreground px-1 pt-1">Other tasks</p>
            )}
            {standalones.map(t => renderTask(t, false))}
          </div>
        )}
      </div>
    </DraggableModal>
  );
}
