import { useRef, useState, useCallback } from 'react';

export function useDraggable() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const startRef = useRef({ mouseX: 0, mouseY: 0, posX: 0, posY: 0 });

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    // only drag on the handle element itself, not its children buttons
    if ((e.target as HTMLElement).closest('button')) return;
    e.preventDefault();
    setDragging(true);
    startRef.current = { mouseX: e.clientX, mouseY: e.clientY, posX: pos.x, posY: pos.y };

    const onMove = (ev: MouseEvent) => {
      setPos({
        x: startRef.current.posX + ev.clientX - startRef.current.mouseX,
        y: startRef.current.posY + ev.clientY - startRef.current.mouseY,
      });
    };
    const onUp = () => {
      setDragging(false);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [pos]);

  const reset = useCallback(() => setPos({ x: 0, y: 0 }), []);

  const style: React.CSSProperties = {
    transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`,
    // override Radix default translate so our offset works
    left: '50%',
    top: '50%',
    position: 'fixed',
    cursor: dragging ? 'grabbing' : undefined,
  };

  return { style, onMouseDown, reset, dragging };
}
