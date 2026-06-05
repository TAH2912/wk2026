import type { MatchStatus, Stage } from "../types";
import { stageLabel } from "../utils/matches";

const statusLabels: Record<MatchStatus, string> = {
  scheduled: "Gepland",
  live: "Live",
  finished: "Afgelopen",
};

const statusStyles: Record<MatchStatus, string> = {
  scheduled: "border-sky-300/30 bg-sky-400/10 text-sky-100",
  live: "border-oranje-300/50 bg-oranje-500/20 text-oranje-100 animate-pulse-glow",
  finished: "border-emerald-300/30 bg-emerald-400/10 text-emerald-100",
};

export const StatusBadge = ({ status }: { status: MatchStatus }) => (
  <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${statusStyles[status]}`}>
    {statusLabels[status]}
  </span>
);

export const StageBadge = ({ stage, group }: { stage: Stage; group?: string }) => (
  <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-slate-200">
    {stage === "group" ? group ?? "Poulefase" : stageLabel(stage)}
  </span>
);
