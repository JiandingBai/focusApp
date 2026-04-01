import { useRef, useState, useCallback } from 'react';

interface UseDraggableOptions {
  initialOffset?: { x: number; y: number };
}

export function useDraggable(options: UseDraggableOptions = {}) {
  const { initialOffset = { x: 0, y: 0 } } = options;
  const [pos, setPos] = useState(initialOffset);
  const [dragging, setDragging] = useState(false);
  const startRef = useRef({ mouseX: 0, mouseY: 0, posX: 0, posY: 0 });
  const nodeRef = useRef<HTMLElement | null>(null);

  const reset = useCallback(() => setPos(initialOffset), [initialOffset.x, initialOffset.y]);

  const clamp = useCallback((x: number, y: number) => {
    const el = nodeRef.current;
    if (!el) return { x, y };
    const { width, height } = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const minX = -(vw / 2 - width / 2 - 8);
    const maxX =  (vw / 2 - width / 2 - 8);
    const minY = -(vh / 2 - height / 2 - 8);
    const maxY =  (vh / 2 - height / 2 - 8);
    return {
      x: Math.max(minX, Math.min(maxX, x)),
      y: Math.max(minY, Math.min(maxY, y)),
    };
  }, []);

  const ref = useCallback((el: HTMLElement | null) => {
    nodeRef.current = el;
    if (el) {
      requestAnimationFrame(() => {
        setPos(prev => clamp(prev.x, prev.y));
      });
    }
  }, [clamp]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    // Only drag from the title bar — skip the close button
    if ((e.target as HTMLElement).closest('button')) return;
    setDragging(true);
    startRef.current = { mouseX: e.clientX, mouseY: e.clientY, posX: pos.x, posY: pos.y };

    const onMove = (ev: MouseEvent) => {
      setPos(clamp(
        startRef.current.posX + ev.clientX - startRef.current.mouseX,
        startRef.current.posY + ev.clientY - startRef.current.mouseY,
      ));
    };
    const onUp = () => {
      setDragging(false);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [pos, clamp]);

  const style: React.CSSProperties = {
    left: '50%',
    top: '50%',
    transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`,
    cursor: dragging ? 'grabbing' : undefined,
  };

  return { style, onMouseDown, reset, dragging, ref };
}
