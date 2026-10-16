"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";

type Edges = { atStart: boolean; atEnd: boolean };

/** Which ends of a horizontal scroller are reached; a 1px slack absorbs
 * fractional scroll positions. */
export function scrollEdges(
  scrollLeft: number,
  clientWidth: number,
  scrollWidth: number,
): Edges {
  return {
    atStart: scrollLeft <= 1,
    atEnd: scrollLeft + clientWidth >= scrollWidth - 1,
  };
}

export default function QuoteScroller({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState<Edges>({ atStart: true, atEnd: false });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const update = () =>
      setEdges(
        scrollEdges(
          element.scrollLeft,
          element.clientWidth,
          element.scrollWidth,
        ),
      );
    update();
    element.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => {
      element.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, []);

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
        <button
          type="button"
          onClick={() => scroll(-1)}
          disabled={edges.atStart}
        >
          Previous testimonials
        </button>
        <button type="button" onClick={() => scroll(1)} disabled={edges.atEnd}>
          Next testimonials
        </button>
      </div>
    </div>
  );
}
