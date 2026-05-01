import { useRef, useEffect } from "react";

export const useDragScroll = (ref: React.RefObject<HTMLElement | null>) => {
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startScrollTop = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startY.current = e.clientY;
    startScrollTop.current = ref.current?.scrollTop ?? 0;
    document.body.style.userSelect = 'none'
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const delta = e.clientY - startY.current;
      if (ref.current) ref.current.scrollTop = startScrollTop.current - delta;
    };

    const onMouseUp = () => {
      isDragging.current = false;
      document.body.style.userSelect = ''
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [ref]);

  return { onMouseDown };
};
