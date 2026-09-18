import { useEffect, useRef, type ButtonHTMLAttributes, type CSSProperties, type ReactNode } from "react";
import { Color, Mesh, Program, Renderer, Triangle } from "ogl";
import "./specular-button.css";

const VERTEX_SHADER = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;
uniform vec2 uCenter;
uniform vec2 uHalfSize;
uniform float uRadius;
uniform float uAngle;
uniform float uPx;
uniform vec3 uLineColor;
uniform vec3 uBaseColor;
uniform float uIntensity;
uniform float uShineSize;
uniform float uShineFade;
uniform float uThickness;
out vec4 fragColor;

float roundedRect(vec2 point, vec2 bounds, float radius) {
  vec2 distance = abs(point) - bounds + radius;
  return length(max(distance, 0.0)) + min(max(distance.x, distance.y), 0.0) - radius;
}

void main() {
  vec2 point = gl_FragCoord.xy - uCenter;
  float distance = roundedRect(point, uHalfSize, uRadius);
  vec2 light = vec2(cos(uAngle), sin(uAngle));
  float base = (1.0 - smoothstep(0.0, uPx, abs(distance))) * 0.55;
  vec2 normal = normalize(point / (uHalfSize * uHalfSize) + 1e-6);
  float angle = acos(clamp(abs(dot(normal, light)), 0.0, 1.0));
  float rim = 1.0 - smoothstep(uShineSize - uShineFade, uShineSize + uShineFade, angle);
  float line = exp(-pow(distance / (uThickness + 1e-6), 2.0));
  float edge = 1.0 - smoothstep(0.5 * uPx, 3.0 * uPx, abs(distance));
  float shine = line * rim * edge * uIntensity;
  vec3 color = uBaseColor * base + uLineColor * shine;
  fragColor = vec4(color, clamp(base + shine, 0.0, 1.0));
}`;

type SpecularButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "size"> & {
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  radius?: number;
  lineColor?: string;
  baseColor?: string;
  intensity?: number;
  shineSize?: number;
  shineFade?: number;
  thickness?: number;
  speed?: number;
  followMouse?: boolean;
  proximity?: number;
  autoAnimate?: boolean;
};

export default function SpecularButton({
  children,
  size = "md",
  radius = 18,
  lineColor = "#ffffff",
  baseColor = "#525252",
  intensity = 1,
  shineSize = 10,
  shineFade = 40,
  thickness = 1,
  speed = 0.35,
  followMouse = true,
  proximity = 250,
  autoAnimate = true,
  className = "",
  ...buttonProps
}: SpecularButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const effectRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    const effect = effectRef.current;
    if (!button || !effect) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let renderer: Renderer;
    try {
      renderer = new Renderer({ alpha: true, premultipliedAlpha: true, antialias: true, dpr: 1 });
    } catch {
      return;
    }

    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: VERTEX_SHADER,
      fragment: FRAGMENT_SHADER,
      uniforms: {
        uCenter: { value: [0, 0] },
        uHalfSize: { value: [1, 1] },
        uRadius: { value: 0 },
        uAngle: { value: 2.4 },
        uPx: { value: window.devicePixelRatio || 1 },
        uLineColor: { value: [1, 1, 1] },
        uBaseColor: { value: [0.32, 0.32, 0.32] },
        uIntensity: { value: 1 },
        uShineSize: { value: 0.17 },
        uShineFade: { value: 0.7 },
        uThickness: { value: 1 },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });
    effect.appendChild(gl.canvas);

    const resize = () => {
      const rect = button.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height);
      program.uniforms.uCenter.value = [rect.width / 2, rect.height / 2];
      program.uniforms.uHalfSize.value = [rect.width / 2, rect.height / 2];
      program.uniforms.uRadius.value = Math.min(radius, Math.min(rect.width, rect.height) / 2);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(button);
    resize();

    let pointerAngle: number | null = null;
    let proximityAmount = 0;
    const onPointerMove = (event: PointerEvent) => {
      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distanceX = Math.max(rect.left - event.clientX, 0, event.clientX - rect.right);
      const distanceY = Math.max(rect.top - event.clientY, 0, event.clientY - rect.bottom);
      const distance = Math.hypot(distanceX, distanceY);
      pointerAngle = Math.atan2(centerY - event.clientY, event.clientX - centerX);
      const amount = Math.max(0, 1 - distance / Math.max(proximity, 1));
      proximityAmount = amount * amount * (3 - 2 * amount);
    };
    window.addEventListener("pointermove", onPointerMove);

    let angle = 2.4;
    let idleAngle = 2.4;
    let brightness = 0;
    let previous = performance.now();
    let frame = 0;
    const line = new Color(lineColor);
    const base = new Color(baseColor);
    const update = (now: number) => {
      frame = requestAnimationFrame(update);
      const delta = Math.min((now - previous) / 1000, 0.05);
      previous = now;
      idleAngle += speed * delta;
      const target = followMouse && pointerAngle !== null && proximityAmount > 0 ? pointerAngle : idleAngle;
      const difference = ((target - angle + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
      angle += difference * (1 - Math.exp(-delta * 7));
      const targetBrightness = autoAnimate || reducedMotion.matches ? 1 : proximityAmount;
      brightness += (targetBrightness - brightness) * (1 - Math.exp(-delta * 8));
      program.uniforms.uAngle.value = angle;
      program.uniforms.uLineColor.value = [line.r, line.g, line.b];
      program.uniforms.uBaseColor.value = [base.r, base.g, base.b];
      program.uniforms.uIntensity.value = intensity * brightness;
      program.uniforms.uShineSize.value = (shineSize * Math.PI) / 180;
      program.uniforms.uShineFade.value = (shineFade * Math.PI) / 180;
      program.uniforms.uThickness.value = thickness;
      renderer.render({ scene: mesh });
    };
    frame = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      if (gl.canvas.parentNode === effect) gl.canvas.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [autoAnimate, baseColor, followMouse, intensity, lineColor, proximity, radius, shineFade, shineSize, speed, thickness]);

  return (
    <button
      ref={buttonRef}
      className={`specular-button specular-button--${size} ${className}`}
      style={{ "--sb-radius": `${radius}px` } as CSSProperties}
      {...buttonProps}
    >
      <span ref={effectRef} className="specular-button__fx" aria-hidden="true" />
      <span className="specular-button__label">{children}</span>
    </button>
  );
}