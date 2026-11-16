import React, { useState, useRef, useEffect } from 'react';

const DraggableSticker = ({
  children,
  className = '',
  initialX = 0,
  initialY = 0,
  baseZIndex = 3,
}) => {
  const [pos, setPos] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ active: false, startX: 0, startY: 0, originX: 0, originY: 0 });

  useEffect(() => {
    const onPointerMove = (e) => {
      if (!dragRef.current.active) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      setPos({
        x: dragRef.current.originX + dx,
        y: dragRef.current.originY + dy,
      });
    };

    const onPointerUp = () => {
      if (!dragRef.current.active) return;
      dragRef.current.active = false;
      setIsDragging(false);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
  }, []);

  const handlePointerDown = (e) => {
    e.preventDefault();
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      originX: pos.x,
      originY: pos.y,
    };
    setIsDragging(true);
  };

  return (
    <div
      className={`draggable-sticker ${isDragging ? 'is-dragging' : ''} ${className}`}
      onPointerDown={handlePointerDown}
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        zIndex: isDragging ? 500 : baseZIndex,
      }}
    >
      {children}
    </div>
  );
};

export default DraggableSticker;

