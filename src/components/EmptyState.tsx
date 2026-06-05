import type { ReactNode } from "react";

export const EmptyState = ({ title, body, action }: { title: string; body: string; action?: ReactNode }) => (
  <div className="glass flex min-h-52 flex-col items-center justify-center p-8 text-center">
    <p className="text-lg font-extrabold text-white">{title}</p>
    <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">{body}</p>
    {action ? <div className="mt-5">{action}</div> : null}
  </div>
);
