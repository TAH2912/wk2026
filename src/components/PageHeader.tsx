import type { ReactNode } from "react";

export const PageHeader = ({ label, title, body, action }: { label?: string; title: string; body?: string; action?: ReactNode }) => (
  <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
    <div>
      {label ? <p className="mb-2 text-xs font-black uppercase tracking-[0.28em] text-oranje-300">{label}</p> : null}
      <h1 className="font-display text-3xl font-black text-white md:text-5xl">{title}</h1>
      {body ? <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 md:text-base">{body}</p> : null}
    </div>
    {action ? <div className="shrink-0">{action}</div> : null}
  </header>
);
