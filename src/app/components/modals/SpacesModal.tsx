import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { useAppStore } from '../../stores/useAppStore';
import imgFrame2 from 'figma:asset/bc1f3b0f6a54eb1a8e1f1398fb79cd46335ef064.png';

interface SpacesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const defaultBackgrounds = [
  { id: 'default', url: imgFrame2, name: 'Default' },
];

export function SpacesModal({ isOpen, onClose }: SpacesModalProps) {
  const { backgroundImage, setBackgroundImage } = useAppStore();
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card/95 backdrop-blur-sm border-sidebar-border">
        <DialogHeader>
          <DialogTitle>Background Spaces</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            Choose a background for your workspace
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {defaultBackgrounds.map(bg => (
              <button
                key={bg.id}
                onClick={() => {
                  setBackgroundImage(bg.url);
                  onClose();
                }}
                className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                  backgroundImage === bg.url
                    ? 'border-primary ring-2 ring-primary'
                    : 'border-sidebar-border'
                }`}
              >
                <img
                  src={bg.url}
                  alt={bg.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white font-medium">{bg.name}</span>
                </div>
              </button>
            ))}
            
            {/* Placeholder for user-uploaded backgrounds */}
            <div className="aspect-video rounded-lg border-2 border-dashed border-sidebar-border flex items-center justify-center bg-muted/50">
              <div className="text-center p-4">
                <p className="text-xs text-muted-foreground">
                  More backgrounds coming soon...
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
