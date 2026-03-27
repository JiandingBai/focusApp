import { useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { useAppStore } from '../../stores/useAppStore';
import { Upload } from 'lucide-react';
import imgFrame2 from '../../../assets/bc1f3b0f6a54eb1a8e1f1398fb79cd46335ef064.png';
import { DraggableModal } from './DraggableModal';

interface SpacesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESETS = [
  { id: 'default', url: imgFrame2, name: 'Default' },
];

export function SpacesModal({ isOpen, onClose }: SpacesModalProps) {
  const { backgroundImage, setBackgroundImage } = useAppStore();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setBackgroundImage(url);
    onClose();
  };

  return (
    <DraggableModal isOpen={isOpen} onClose={onClose} className="max-w-sm">
      <DialogHeader>
        <DialogTitle>Background</DialogTitle>
      </DialogHeader>

        <div className="py-2 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {PRESETS.map(bg => (
              <button key={bg.id} onClick={() => { setBackgroundImage(bg.url); onClose(); }}
                className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${backgroundImage === bg.url ? 'border-primary ring-2 ring-primary' : 'border-sidebar-border'}`}>
                <img src={bg.url} alt={bg.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 flex items-end p-1">
                  <span className="text-white text-xs font-medium">{bg.name}</span>
                </div>
              </button>
            ))}

            <button onClick={() => fileRef.current?.click()}
              className="aspect-video rounded-lg border-2 border-dashed border-sidebar-border flex flex-col items-center justify-center gap-1 hover:border-primary hover:bg-accent/30 transition-all">
              <Upload className="w-5 h-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Upload image</span>
            </button>
          </div>

          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </div>
    </DraggableModal>
  );
}
