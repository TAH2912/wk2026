import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Medal, Target, Trophy, Users } from "lucide-react";
import type { AppDataContext } from "../useAppData";
import { LeaderboardPodium } from "../components/LeaderboardPodium";
import { PageHeader } from "../components/PageHeader";
import { StatCard } from "../components/StatCard";
import { calculateFriendsLeaderboard } from "../utils/leaderboard";

export const LeaderboardPage = ({ data }: { data: AppDataContext }) => {
  const rows = calculateFriendsLeaderboard(data.friends, data.pools, data.matches);
  const chart = rows.map((row) => ({ name: row.friend.name, punten: row.totalPoints }));

  return (
    <div>
      <PageHeader label="Klassement" title="Vriendenklassement" body="Alle gespeelde pools worden samengevoegd tot een totaalstand." />
      <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Deelnemers" value={rows.length} icon={<Users />} />
        <StatCard label="Voorspellingen" value={rows.reduce((sum, row) => sum + row.predictions, 0)} icon={<Target />} accent="text-sky-300" />
        <StatCard label="Exacte scores" value={rows.reduce((sum, row) => sum + row.exactScores, 0)} icon={<Trophy />} accent="text-emerald-300" />
        <StatCard label="Leider" value={rows[0]?.friend.name ?? "-"} icon={<Medal />} accent="text-amber-300" />
      </section>
      <LeaderboardPodium rows={rows} />
      <section className="mt-6 grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="glass p-5">
          <h2 className="mb-4 text-xl font-black text-white">Punten per vriend</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" allowDecimals={false} />
                <Tooltip contentStyle={{ background: "#0f1830", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12 }} />
                <Bar dataKey="punten" fill="#ff6b00" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass overflow-hidden">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-white/[0.03] text-xs uppercase text-slate-400">
              <tr>
                {["#", "Naam", "Punten", "Voorsp.", "Exact", "Gewonnen", "Gem."].map((head) => <th key={head} className="px-4 py-3 font-black">{head}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.friend.id} className="border-t border-white/5">
                  <td className="px-4 py-3 font-black">{index + 1}</td>
                  <td className="px-4 py-3 font-black text-white">{row.friend.name}</td>
                  <td className="px-4 py-3">{row.totalPoints}</td>
                  <td className="px-4 py-3">{row.predictions}</td>
                  <td className="px-4 py-3">{row.exactScores}</td>
                  <td className="px-4 py-3">{row.wonPools}</td>
                  <td className="px-4 py-3">{row.averagePoints.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
