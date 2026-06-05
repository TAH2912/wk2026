import type { AppDataContext } from "../useAppData";
import { PageHeader } from "../components/PageHeader";
import { calculateBestThirdPlacedTeams, calculateGroupStandings } from "../utils/standings";

export const GroupStandingsPage = ({ data }: { data: AppDataContext }) => {
  const standings = calculateGroupStandings(data.matches, data.groups);
  const thirds = calculateBestThirdPlacedTeams(standings);

  return (
    <div>
      <PageHeader label="Poules" title="Poulestanden" body="Standen worden automatisch berekend uit gespeelde groepswedstrijden en jouw lokale uitslagen." />
      <div className="mb-6 flex flex-wrap gap-3 text-xs font-bold text-slate-300">
        <span className="rounded-full bg-emerald-400/15 px-3 py-2 text-emerald-100">Top 2 gaat door</span>
        <span className="rounded-full bg-oranje-400/15 px-3 py-2 text-oranje-100">Nummer 3 maakt kans</span>
        <span className="rounded-full bg-white/10 px-3 py-2">Nummer 4 neutraal</span>
      </div>
      <section className="grid gap-5 xl:grid-cols-2">
        {standings.map((group) => (
          <article key={group.group} className="glass overflow-hidden">
            <h2 className="border-b border-white/10 px-5 py-4 text-xl font-black text-white">{group.group}</h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-sm">
                <thead className="bg-white/[0.03] text-xs uppercase text-slate-400">
                  <tr>
                    {["#", "Team", "GS", "W", "GL", "V", "DV", "DT", "DS", "P"].map((head) => (
                      <th key={head} className="px-3 py-3 font-black">{head}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {group.rows.map((row, index) => (
                    <tr key={row.team} className={`border-t border-white/5 ${index < 2 ? "bg-emerald-400/5" : index === 2 ? "bg-oranje-400/5" : ""}`}>
                      <td className="px-3 py-3 font-black text-slate-400">{index + 1}</td>
                      <td className="px-3 py-3 font-black text-white">{row.team}</td>
                      <td className="px-3 py-3">{row.played}</td>
                      <td className="px-3 py-3">{row.won}</td>
                      <td className="px-3 py-3">{row.drawn}</td>
                      <td className="px-3 py-3">{row.lost}</td>
                      <td className="px-3 py-3">{row.goalsFor}</td>
                      <td className="px-3 py-3">{row.goalsAgainst}</td>
                      <td className="px-3 py-3">{row.goalDifference}</td>
                      <td className="px-3 py-3 font-black text-white">{row.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-2xl font-black text-white">Beste nummers 3</h2>
        <div className="glass overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-white/[0.03] text-xs uppercase text-slate-400">
                <tr>
                  {["Rang", "Team", "Poule", "Punten", "DS", "DV", "Status"].map((head) => (
                    <th key={head} className="px-4 py-3 font-black">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {thirds.map((row) => (
                  <tr key={`${row.group}-${row.team}`} className="border-t border-white/5">
                    <td className="px-4 py-3 font-black">{row.rank}</td>
                    <td className="px-4 py-3 font-black text-white">{row.team}</td>
                    <td className="px-4 py-3">{row.group}</td>
                    <td className="px-4 py-3">{row.points}</td>
                    <td className="px-4 py-3">{row.goalDifference}</td>
                    <td className="px-4 py-3">{row.goalsFor}</td>
                    <td className={`px-4 py-3 font-bold ${row.rank <= 8 ? "text-emerald-200" : "text-slate-400"}`}>{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};
