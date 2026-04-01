import { type ReactNode, useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, GripHorizontal } from 'lucide-react';
import { useDraggable } from '../../hooks/useDraggable';

interface DraggableModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  style?: React.CSSProperties;
  children: ReactNode;
  initialOffset?: { x: number; y: number };
  minWidth?: number;
  minHeight?: number;
}

export function DraggableModal({
  isOpen,
  onClose,
  className = '',
  style: styleProp,
  children,
  initialOffset,
  minWidth = 280,
  minHeight = 120,
}: DraggableModalProps) {
  const { style, onMouseDown, reset, ref } = useDraggable({ initialOffset });
  const [size, setSize] = useState<{ width: number | 'auto'; height: number | 'auto' }>({ width: 'auto', height: 'auto' });
  const resizeStart = useRef<{ mouseX: number; mouseY: number; w: number; h: number } | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') { reset(); onClose(); } };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose, reset]);

  useEffect(() => {
    if (!isOpen) setSize({ width: 'auto', height: 'auto' });
  }, [isOpen]);

  const onResizeMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    resizeStart.current = { mouseX: e.clientX, mouseY: e.clientY, w: rect.width, h: rect.height };
    const onMove = (ev: MouseEvent) => {
      if (!resizeStart.current) return;
      setSize({
        width: Math.max(minWidth, resizeStart.current.w + ev.clientX - resizeStart.current.mouseX),
        height: Math.max(minHeight, resizeStart.current.h + ev.clientY - resizeStart.current.mouseY),
      });
    };
    const onUp = () => {
      resizeStart.current = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [minWidth, minHeight]);

  const setRefs = useCallback((el: HTMLDivElement | null) => {
    containerRef.current = el;
    (ref as (el: HTMLElement | null) => void)(el);
  }, [ref]);

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={setRefs}
      className={`fixed z-50 bg-background/95 backdrop-blur-xl border border-border rounded-lg shadow-lg shadow-rose-200/30 w-full ${className}`}
      style={{
        ...style,
        ...styleProp,
        ...(size.width !== 'auto' ? { width: size.width } : {}),
        ...(size.height !== 'auto' ? { height: size.height, overflow: 'auto' } : {}),
      }}
    >
      {/* title bar — drag handle only, no interference with content */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b border-border cursor-grab active:cursor-grabbing select-none"
        onMouseDown={onMouseDown}
      >
        <GripHorizontal className="w-4 h-4 text-muted-foreground/40" />
        <button
          onClick={() => { reset(); onClose(); }}
          className="rounded-sm opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      {/* content — completely separate from drag handle */}
      <div className="p-6 pb-8 flex flex-col" style={size.height !== 'auto' ? { height: 'calc(100% - 37px)', overflow: 'auto' } : undefined}>
        {children}
      </div>
      {/* resize handle */}
      <div
        onMouseDown={onResizeMouseDown}
        className="absolute bottom-1 right-1 w-4 h-4 flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity cursor-se-resize"
        title="Resize"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
          <path d="M9 1L1 9M9 5L5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
    </div>,
    document.body
  );
}
