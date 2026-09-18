import { useRef, type CSSProperties, type HTMLAttributes } from "react";
import "./glare-card.css";

type GlareCardProps = HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

export function GlareCard({ children, className = "", onPointerMove, onPointerLeave, ...props }: GlareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={cardRef}
      className={`glare-card ${className}`}
      onPointerMove={(event) => {
        const card = cardRef.current;
        if (card) {
          const bounds = card.getBoundingClientRect();
          card.style.setProperty("--glare-x", `${event.clientX - bounds.left}px`);
          card.style.setProperty("--glare-y", `${event.clientY - bounds.top}px`);
          card.style.setProperty("--glare-opacity", "1");
        }
        onPointerMove?.(event);
      }}
      onPointerLeave={(event) => {
        cardRef.current?.style.setProperty("--glare-opacity", "0");
        onPointerLeave?.(event);
      }}
      style={{ "--glare-opacity": 0 } as CSSProperties}
      {...props}
    >
      <div className="glare-card__content">{children}</div>
    </div>
  );
}