import { Crown, Medal } from "lucide-react";
import type { LeaderboardRow } from "../types";

export const LeaderboardPodium = ({ rows }: { rows: LeaderboardRow[] }) => {
  const top = rows.slice(0, 3);
  if (!top.length) return null;
  const order = [top[1], top[0], top[2]].filter(Boolean);

  return (
    <div className="grid gap-4 md:grid-cols-3 md:items-end">
      {order.map((row) => {
        const rank = rows.indexOf(row) + 1;
        const isFirst = rank === 1;
        return (
          <article key={row.friend.id} className={`glass relative overflow-hidden p-5 text-center ${isFirst ? "md:min-h-64 border-oranje-300/40" : "md:min-h-52"}`}>
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-oranje-400 to-transparent" />
            <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${isFirst ? "bg-oranje-500 text-white shadow-glow" : "bg-white/10 text-slate-200"}`}>
              {isFirst ? <Crown /> : <Medal />}
            </div>
            <p className="mt-4 text-sm font-black uppercase tracking-[0.2em] text-oranje-200">Plek {rank}</p>
            <h3 className="mt-2 text-2xl font-black text-white">{row.friend.name}</h3>
            <p className="mt-3 text-5xl font-black text-white">{row.totalPoints}</p>
            <p className="text-sm font-bold text-slate-400">punten</p>
          </article>
        );
      })}
    </div>
  );
};
