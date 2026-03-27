import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { AmbientSoundPlayer } from '../AmbientSoundPlayer';
import { DraggableModal } from './DraggableModal';

interface SoundsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SoundsModal({ isOpen, onClose }: SoundsModalProps) {
  return (
    <DraggableModal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <DialogHeader>
        <DialogTitle>Ambient Sounds</DialogTitle>
      </DialogHeader>
      <div className="py-4">
        <AmbientSoundPlayer />
      </div>
    </DraggableModal>
  );
}
