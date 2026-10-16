"use client";
import { useRef, type ReactNode } from "react";
export default function QuoteScroller({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  function scroll(direction: number) {
    if (ref.current)
      ref.current.scrollBy({
        left: direction * ref.current.clientWidth,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
  }
  return (
    <div>
      <div
        className="home-quotes"
        ref={ref}
        tabIndex={0}
        role="region"
        aria-label="Parent testimonials"
      >
        {children}
      </div>
      <div className="home-quote-controls">
        <button type="button" onClick={() => scroll(-1)}>
          Previous testimonials
        </button>
        <button type="button" onClick={() => scroll(1)}>
          Next testimonials
        </button>
      </div>
    </div>
  );
}
