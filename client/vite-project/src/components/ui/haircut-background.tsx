import { useEffect, useRef } from "react";

type Strand = {
  x: number;
  y: number;
  length: number;
  width: number;
  speed: number;
  sway: number;
  phase: number;
  alpha: number;
};

const variation = (index: number, salt: number) => {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
};

const createStrand = (width: number, height: number, index: number): Strand => ({
  x: variation(index, 1) * width,
  y: variation(index, 2) * height,
  length: 70 + variation(index, 3) * 180,
  width: 0.5 + variation(index, 4) * 1.5,
  speed: 0.12 + variation(index, 5) * 0.22,
  sway: 8 + variation(index, 6) * 18,
  phase: variation(index, 7) * Math.PI * 2,
  alpha: 0.28 + variation(index, 8) * 0.42,
});

export function HaircutBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame = 0;
    let strands: Strand[] = [];
    let width = 0;
    let height = 0;
      let pixelRatio = 1;
      const startTime = performance.now();

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const strandCount = Math.min(85, Math.max(34, Math.round((width * height) / 18000)));
      strands = Array.from({ length: strandCount }, (_, index) => createStrand(width, height, index));
    };

    const render = (now: number) => {
      const elapsed = now - startTime;
      context.clearRect(0, 0, width, height);
      context.fillStyle = "rgba(5, 5, 5, 0.2)";
      context.fillRect(0, 0, width, height);

      for (let index = 0; index < 18; index += 1) {
        const travel = (index / 18) * width + Math.sin(elapsed * 0.0004 + index) * 26;
        const drift = Math.sin(elapsed * 0.00045 + index) * 34;
        const gradient = context.createLinearGradient(travel, 0, travel + 120, height);
        gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
        gradient.addColorStop(0.3, "rgba(186, 230, 253, 0.24)");
        gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.42)");
        gradient.addColorStop(0.7, "rgba(186, 230, 253, 0.24)");
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        context.beginPath();
        context.moveTo(travel - 40, -40);
        context.bezierCurveTo(
          travel + 100 + drift,
          height * 0.28,
          travel - 70 - drift,
          height * 0.7,
          travel + 120,
          height + 40,
        );
        context.strokeStyle = gradient;
        context.lineWidth = 3;
        context.stroke();
      }

      for (const strand of strands) {
        const travel = motionQuery.matches ? 0 : (elapsed * strand.speed) % (height + strand.length);
        const y = strand.y + travel;
        const wrappedY = y > height + strand.length ? y - height - strand.length : y;
        const sway = Math.sin(elapsed * 0.0007 + strand.phase) * strand.sway;
        const gradient = context.createLinearGradient(strand.x, wrappedY, strand.x + sway, wrappedY + strand.length);
        gradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
        gradient.addColorStop(0.45, `rgba(226, 232, 240, ${strand.alpha})`);
        gradient.addColorStop(1, "rgba(148, 163, 184, 0)");

        context.beginPath();
        context.moveTo(strand.x, wrappedY);
        context.bezierCurveTo(
          strand.x + sway * 0.4,
          wrappedY + strand.length * 0.3,
          strand.x - sway,
          wrappedY + strand.length * 0.7,
          strand.x + sway,
          wrappedY + strand.length,
        );
        context.strokeStyle = gradient;
            context.lineWidth = strand.width;
        context.stroke();
      }

      if (!motionQuery.matches) animationFrame = requestAnimationFrame(render);
    };

    resize();
    render(startTime);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="haircut-bg" aria-hidden="true">
      <canvas ref={canvasRef} className="haircut-bg__canvas" />
    </div>
  );
}