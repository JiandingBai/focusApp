
import { StudyRoomContent } from '../StudyRoomContent';
import { DraggableModal } from './DraggableModal';

interface FriendsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOffset?: { x: number; y: number };
}

export function FriendsModal({ isOpen, onClose, initialOffset }: FriendsModalProps) {
  return (
    <DraggableModal isOpen={isOpen} onClose={onClose} className="max-w-4xl max-h-[80vh] overflow-y-auto" initialOffset={initialOffset}>
      <StudyRoomContent />
    </DraggableModal>
  );
}
