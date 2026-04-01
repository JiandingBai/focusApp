
import { AmbientSoundPlayer } from '../AmbientSoundPlayer';
import { DraggableModal } from './DraggableModal';

interface SoundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOffset?: { x: number; y: number };
}

export function SoundsModal({ isOpen, onClose, initialOffset }: SoundsModalProps) {
  return (
    <DraggableModal isOpen={isOpen} onClose={onClose} className="max-w-md" initialOffset={initialOffset}>
      <div className="flex flex-col gap-2 mb-2">
        <h2 className="text-lg font-semibold leading-none">Ambient Sounds</h2>
      </div>
      <div className="py-4">
        <AmbientSoundPlayer />
      </div>
    </DraggableModal>
  );
}
