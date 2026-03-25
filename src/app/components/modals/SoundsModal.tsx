import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { AmbientSoundPlayer } from '../AmbientSoundPlayer';

interface SoundsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SoundsModal({ isOpen, onClose }: SoundsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-card/95 backdrop-blur-sm border-sidebar-border">
        <DialogHeader>
          <DialogTitle>Ambient Sounds</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <AmbientSoundPlayer />
        </div>
      </DialogContent>
    </Dialog>
  );
}
