import { useRef, useState, useEffect } from "react";

export function useReveal(options?: { threshold?: number; rootMargin?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = typeof window !== "undefined"
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [isVisible, setIsVisible] = useState(prefersReduced);

  useEffect(() => {
    if (prefersReduced) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: options?.threshold ?? 0.15, rootMargin: options?.rootMargin ?? "0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [prefersReduced, options?.threshold, options?.rootMargin]);

  return { ref, isVisible };
}
