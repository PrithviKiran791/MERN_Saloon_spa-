import "./aurora-background.css";

export function AuroraBackground({ className = "" }: Readonly<{ className?: string }>) {
  return <div className={`aurora-background ${className}`} aria-hidden="true" />;
}
