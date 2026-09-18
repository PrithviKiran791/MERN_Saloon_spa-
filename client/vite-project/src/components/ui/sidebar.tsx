import { motion } from "motion/react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export type SidebarLinkItem = {
  label: string;
  href: string;
  icon: ReactNode;
};

type SidebarProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  children: ReactNode;
};

export function Sidebar({ open, setOpen, children }: Readonly<SidebarProps>) {
  return (
    <motion.aside
      animate={{ width: open ? 256 : 76 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="fixed left-0 top-16 bottom-0 z-30 overflow-hidden border-r border-slate-200 bg-white/95 shadow-xl backdrop-blur-xl"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {children}
    </motion.aside>
  );
}

export function SidebarBody({ children, className = "" }: Readonly<{ children: ReactNode; className?: string }>) {
  return <div className={`flex h-full flex-col p-3 ${className}`}>{children}</div>;
}

export function SidebarLink({ link, open, active = false }: Readonly<{ link: SidebarLinkItem; open: boolean; active?: boolean }>) {
  return (
    <Link
      to={link.href}
      className={`flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${active ? "text-white" : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"}`}
    >
      <span className="grid size-6 shrink-0 place-items-center">{link.icon}</span>
      <motion.span
        animate={{ opacity: open ? 1 : 0, width: open ? "auto" : 0 }}
        transition={{ duration: 0.15 }}
        className="overflow-hidden whitespace-nowrap"
      >
        {link.label}
      </motion.span>
    </Link>
  );
}
