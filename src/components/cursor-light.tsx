"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

export function CursorLight() {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 150, damping: 28, mass: 0.45 });
  const y = useSpring(rawY, { stiffness: 150, damping: 28, mass: 0.45 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updatePosition = (event: PointerEvent) => {
      rawX.set(event.clientX + window.scrollX);
      rawY.set(event.clientY + window.scrollY);
      setIsVisible(true);
    };

    const hideLight = () => setIsVisible(false);

    window.addEventListener("pointermove", updatePosition, { passive: true });
    window.addEventListener("pointerleave", hideLight);
    window.addEventListener("blur", hideLight);

    return () => {
      window.removeEventListener("pointermove", updatePosition);
      window.removeEventListener("pointerleave", hideLight);
      window.removeEventListener("blur", hideLight);
    };
  }, [rawX, rawY]);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 -z-10 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(125,211,252,0.38),rgba(59,130,246,0.24)_34%,rgba(217,70,239,0.16)_54%,transparent_76%)] blur-3xl saturate-150"
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.2 }}
      style={{ x, y }}
    />
  );
}
