import type { HTMLAttributes, ReactNode } from "react";
import "./background-gradient.css";

type BackgroundGradientProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function BackgroundGradient({ children, className = "", ...props }: Readonly<BackgroundGradientProps>) {
  return (
    <div className={`background-gradient ${className}`} {...props}>
      <div className="background-gradient__inner">{children}</div>
    </div>
  );
}
