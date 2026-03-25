import { Dialog, DialogContent } from '../ui/dialog';
import { StudyRoomContent } from '../StudyRoomContent';

interface FriendsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FriendsModal({ isOpen, onClose }: FriendsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-card/95 backdrop-blur-sm border-sidebar-border max-h-[80vh] overflow-y-auto">
        <StudyRoomContent />
      </DialogContent>
    </Dialog>
  );
}
