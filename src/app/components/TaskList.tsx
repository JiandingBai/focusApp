import { useState } from 'react';
import { useAppStore } from '../stores/useAppStore';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Trash2, Clock, Calendar, Play } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export function TaskList({ onStartTask }: { onStartTask?: (taskId: string) => void }) {
  const { tasks, addTask, deleteTask, toggleTask } = useAppStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    estimatedMinutes: 25,
    dueDate: '',
  });
  
  const handleAddTask = () => {
    if (!newTask.title.trim()) return;
    
    addTask({
      title: newTask.title,
      priority: newTask.priority,
      estimatedMinutes: newTask.estimatedMinutes,
      dueDate: newTask.dueDate ? new Date(newTask.dueDate) : undefined,
    });
    
    setNewTask({
      title: '',
      priority: 'medium',
      estimatedMinutes: 25,
      dueDate: '',
    });
    setIsAdding(false);
    toast.success('Task added successfully');
  };
  
  const sortedTasks = [...tasks].sort((a, b) => {
    // Incomplete tasks first
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    
    // Then by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (a.priority !== b.priority) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    
    // Then by due date
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    
    return 0;
  });
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'low':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-black">Tasks ({tasks.filter(t => !t.completed).length} active)</h3>
        <Button
          onClick={() => setIsAdding(!isAdding)}
          size="sm"
          variant={isAdding ? "outline" : "default"}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Task
        </Button>
      </div>
      
      {isAdding && (
        <Card className="p-4 space-y-3 border-sidebar-border bg-card/80 backdrop-blur-sm">
          <Input
            placeholder="Task title..."
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            autoFocus
          />
          
          <div className="grid grid-cols-3 gap-2">
            <Select
              value={newTask.priority}
              onValueChange={(value: any) => setNewTask({ ...newTask, priority: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
            
            <Input
              type="number"
              placeholder="Minutes"
              value={newTask.estimatedMinutes}
              onChange={(e) =>
                setNewTask({ ...newTask, estimatedMinutes: parseInt(e.target.value) || 25 })
              }
            />
            
            <Input
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            />
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleAddTask} className="flex-1">
              Add Task
            </Button>
            <Button onClick={() => setIsAdding(false)} variant="outline">
              Cancel
            </Button>
          </div>
        </Card>
      )}
      
      <div className="space-y-2">
        {sortedTasks.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            <p>No tasks yet. Add your first task to get started!</p>
          </Card>
        ) : (
          sortedTasks.map((task) => (
            <Card
              key={task.id}
              className={`p-3 transition-all ${task.completed ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTask(task.id)}
                  className="mt-1"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {task.title}
                    </p>
                    <div className="flex gap-1 flex-shrink-0">
                      {onStartTask && !task.completed && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onStartTask(task.id)}
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          deleteTask(task.id);
                          toast.success('Task deleted');
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge variant="outline" className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                    
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {task.estimatedMinutes}m
                    </div>
                    
                    {task.dueDate && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(task.dueDate), 'MMM d')}
                      </div>
                    )}
                    
                    {task.timeSpent > 0 && (
                      <div className="text-xs text-muted-foreground">
                        {Math.floor(task.timeSpent / 60)}m spent
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}