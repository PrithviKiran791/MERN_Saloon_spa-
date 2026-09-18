import { UserRound } from "lucide-react";
import { useState, type FC, type ReactNode } from "react";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

type AvatarProps = {
  size?: AvatarSize;
  className?: string;
  src?: string | null;
  alt?: string;
  initials?: string;
  status?: "online" | "offline";
  verified?: boolean;
  count?: number;
  placeholder?: ReactNode;
  placeholderIcon?: FC<{ className?: string }>;
  border?: boolean;
  rounded?: boolean;
};

const sizeStyles: Record<AvatarSize, { root: string; text: string; icon: string }> = {
  xs: { root: "size-6", text: "text-xs", icon: "size-4" },
  sm: { root: "size-8", text: "text-sm", icon: "size-5" },
  md: { root: "size-10", text: "text-base", icon: "size-6" },
  lg: { root: "size-12", text: "text-lg", icon: "size-7" },
  xl: { root: "size-14", text: "text-xl", icon: "size-8" },
  "2xl": { root: "size-16", text: "text-2xl", icon: "size-8" },
};

export function Avatar({
  size = "md",
  className = "",
  src,
  alt = "",
  initials,
  status,
  verified = false,
  count,
  placeholder,
  placeholderIcon: PlaceholderIcon,
  border = false,
  rounded = true,
}: Readonly<AvatarProps>) {
  const [imageFailed, setImageFailed] = useState(false);
  const styles = sizeStyles[size];
  const showImage = Boolean(src) && !imageFailed;
  const fallback = initials || placeholder;
  const fallbackNode = fallback || (PlaceholderIcon ? <PlaceholderIcon className={styles.icon} /> : <UserRound className={styles.icon} />);
  let content: ReactNode;
  if (showImage) {
    content = <img src={src ?? undefined} alt={alt} className="size-full object-cover" onError={() => setImageFailed(true)} />;
  } else if (typeof fallbackNode === "string") {
    content = <span className={`font-semibold ${styles.text}`}>{fallbackNode}</span>;
  } else {
    content = fallbackNode;
  }

  return (
    <div className={`relative inline-flex shrink-0 items-center justify-center overflow-visible ${styles.root} ${rounded ? "rounded-full" : "rounded-lg"} ${border ? "ring-2 ring-white ring-offset-1 ring-offset-slate-950" : ""} ${className}`}>
      <div className={`flex size-full items-center justify-center overflow-hidden bg-slate-200 text-slate-700 ${rounded ? "rounded-full" : "rounded-lg"}`}>
        {content}
      </div>
      {status && <span className={`absolute bottom-0 right-0 size-2.5 rounded-full ring-2 ring-white ${status === "online" ? "bg-emerald-500" : "bg-slate-400"}`} aria-label={status} />}
      {verified && <span className="absolute -right-0.5 -bottom-0.5 grid size-4 place-items-center rounded-full bg-sky-500 text-[10px] font-bold text-white ring-2 ring-white" aria-label="Verified">&#10003;</span>}
      {count !== undefined && <span className="absolute -right-2 -top-2 grid min-w-5 place-items-center rounded-full bg-slate-950 px-1 text-[10px] font-bold text-white">{count}</span>}
    </div>
  );
}
