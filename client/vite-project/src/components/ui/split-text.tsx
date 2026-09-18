import { useEffect, useRef, type CSSProperties, type ElementType } from "react";
import { gsap } from "gsap";
import "./split-text.css";

type SplitTextProps = {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  threshold?: number;
  rootMargin?: string;
  textAlign?: CSSProperties["textAlign"];
  tag?: ElementType;
  onLetterAnimationComplete?: () => void;
};

export default function SplitText({
  text,
  className = "",
  delay = 50,
  duration = 1.25,
  ease = "power3.out",
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "left",
  tag: Tag = "p",
  onLetterAnimationComplete,
}: Readonly<SplitTextProps>) {
  const containerRef = useRef<HTMLElement>(null);
  const hasAnimated = useRef(false);
  const callbackRef = useRef(onLetterAnimationComplete);

  useEffect(() => {
    callbackRef.current = onLetterAnimationComplete;
  }, [onLetterAnimationComplete]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !text) return;

    const letters = Array.from(container.querySelectorAll<HTMLElement>("[data-split-letter]"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const complete = () => {
      hasAnimated.current = true;
      callbackRef.current?.();
    };

    const animate = () => {
      if (hasAnimated.current) return;

      if (reducedMotion.matches) {
        gsap.set(letters, { opacity: 1, y: 0 });
        complete();
        return;
      }

      gsap.fromTo(
        letters,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration,
          ease,
          stagger: delay / 1000,
          force3D: true,
          onComplete: complete,
        },
      );
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate();
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(container);

    return () => {
      observer.disconnect();
      gsap.killTweensOf(letters);
    };
  }, [delay, duration, ease, rootMargin, text, threshold]);

  return (
    <Tag
      ref={containerRef}
      className={`split-text ${className}`}
      style={{ textAlign }}
      aria-label={text}
    >
      {Array.from(text).map((letter, index) =>
        letter === "\n" ? (
          <br key={`break-${text.slice(0, index)}`} />
        ) : (
          <span
            key={`${letter}-${index}`}
            data-split-letter="true"
            aria-hidden="true"
            className="split-text__letter"
          >
            {letter === " " ? "\u00a0" : letter}
          </span>
        ),
      )}
    </Tag>
  );
}