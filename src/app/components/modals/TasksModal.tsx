import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { TaskList } from '../TaskList';

interface TasksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TasksModal({ isOpen, onClose }: TasksModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card/95 backdrop-blur-sm border-sidebar-border max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tasks</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <TaskList />
        </div>
      </DialogContent>
    </Dialog>
  );
}
