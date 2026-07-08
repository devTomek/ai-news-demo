"use client";

import { ReactLenis } from "lenis/react";

export function SmoothScrollProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.15,
        easing: (time) => Math.min(1, 1.001 - Math.pow(2, -10 * time)),
        smoothWheel: true,
        syncTouch: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
