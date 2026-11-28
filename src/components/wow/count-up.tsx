"use client";

import { useEffect, useState } from "react";

/**
 * Un numero che sale fino al suo valore, una volta sola (16/11/2026). Sul server e con il movimento ridotto il numero
 * è subito quello finale: nessuno vede mai un valore diverso da quello vero.
 */
export function CountUp({ to, ms = 1200 }: { to: number; ms?: number }) {
  const [n, setN] = useState(to);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / ms);
      setN(Math.round(to * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, ms]);
  return <>{n}</>;
}
