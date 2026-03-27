import { type ReactNode } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { useDraggable } from '../../hooks/useDraggable';

interface DraggableModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  children: ReactNode;
}

export function DraggableModal({ isOpen, onClose, className = '', children }: DraggableModalProps) {
  const { style, onMouseDown, reset } = useDraggable();

  const handleOpenChange = (open: boolean) => {
    if (!open) { reset(); onClose(); }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className={`bg-card/95 backdrop-blur-sm border-sidebar-border ${className}`}
        style={style}
        // suppress Radix's own close-on-outside-click so dragging outside doesn't close
        onPointerDownOutside={e => e.preventDefault()}
        onInteractOutside={e => e.preventDefault()}
      >
        {/* drag handle — covers the whole modal, buttons inside still work */}
        <div
          className="absolute inset-0 cursor-grab active:cursor-grabbing rounded-lg"
          onMouseDown={onMouseDown}
          style={{ zIndex: 0 }}
        />
        {/* content sits above the drag handle */}
        <div className="relative" style={{ zIndex: 1 }}>
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
