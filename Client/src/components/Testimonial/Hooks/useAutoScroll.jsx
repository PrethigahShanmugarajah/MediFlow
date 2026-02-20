// MediFlow / Client / src / components / Testimonial / Hooks / useAutoScroll.jsx
import { useEffect } from "react";

export const useAutoScroll = ({ leftRef, rightRef, isPaused, speed = 0.5 }) => {
  useEffect(() => {
    const left = leftRef.current;
    const right = rightRef.current;
    if (!left || !right) return;

    let rafId;

    const smoothScroll = () => {
      if (!isPaused) {
        left.scrollTop += speed;
        right.scrollTop -= speed;

        if (left.scrollTop >= left.scrollHeight / 2) left.scrollTop = 0;
        if (right.scrollTop <= 0) right.scrollTop = right.scrollHeight / 2;
      }
      rafId = requestAnimationFrame(smoothScroll);
    };

    rafId = requestAnimationFrame(smoothScroll);
    return () => cancelAnimationFrame(rafId);
  }, [leftRef, rightRef, isPaused, speed]);
};
