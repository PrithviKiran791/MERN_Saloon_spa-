import React from "react";

interface RippleProps {
  mainCircleSize?: number;
  mainCircleOpacity?: number;
  numCircles?: number;
}

export const Ripple: React.FC<RippleProps> = ({
  mainCircleSize = 210,
  mainCircleOpacity = 0.2,
  numCircles = 8,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
      <style>{`
        @keyframes ripple {
          0% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: ${mainCircleOpacity};
          }
          50% {
            opacity: ${mainCircleOpacity * 0.5};
          }
          100% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0;
          }
        }
        
        .ripple-circle {
          position: absolute;
          top: 50%;
          left: 50%;
          width: ${mainCircleSize}px;
          height: ${mainCircleSize}px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
        }
      `}</style>
      
      {Array.from({ length: numCircles }).map((_, i) => (
        <div
          key={i}
          className="ripple-circle"
          style={{
            animation: `ripple ${2 + i * 0.4}s ease-out infinite`,
            animationDelay: `-${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  );
};
