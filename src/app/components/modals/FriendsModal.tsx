import { Dialog, DialogContent } from '../ui/dialog';
import { StudyRoomContent } from '../StudyRoomContent';
import { DraggableModal } from './DraggableModal';

interface FriendsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FriendsModal({ isOpen, onClose }: FriendsModalProps) {
  return (
    <DraggableModal isOpen={isOpen} onClose={onClose} className="max-w-4xl max-h-[80vh] overflow-y-auto">
      <StudyRoomContent />
    </DraggableModal>
  );
}
