import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  icon?: ReactNode;
};

const styles = {
  primary: "bg-oranje-500 text-white shadow-glow hover:bg-oranje-400",
  secondary: "bg-white/10 text-white border border-white/10 hover:bg-white/15",
  ghost: "text-slate-200 hover:bg-white/10",
  danger: "bg-rose-500/15 text-rose-100 border border-rose-400/30 hover:bg-rose-500/25",
};

export const Button = ({ variant = "primary", icon, className = "", children, ...props }: Props) => (
  <button
    className={`focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`}
    {...props}
  >
    {icon}
    {children}
  </button>
);
