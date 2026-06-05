import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { AppDataContext } from "../useAppData";
import type { Match } from "../types";
import { Button } from "../components/Button";
import { MatchCard } from "../components/MatchCard";
import { MatchEditorModal } from "../components/MatchEditorModal";
import { PageHeader } from "../components/PageHeader";
import { formatDutchDate, isToday } from "../utils/date";

type Filter = "all" | "today" | "netherlands" | "group" | "knockout" | "finished" | "upcoming";

const filters: Array<[Filter, string]> = [
  ["all", "Alle wedstrijden"],
  ["today", "Vandaag"],
  ["netherlands", "Nederland"],
  ["group", "Poulefase"],
  ["knockout", "Knock-out"],
  ["finished", "Afgelopen"],
  ["upcoming", "Komend"],
];

export const SchedulePage = ({ data }: { data: AppDataContext }) => {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Match>();
  const navigate = useNavigate();

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.matches.filter((match) => {
      const byFilter =
        filter === "all" ||
        (filter === "today" && isToday(match.dateTimeLocal)) ||
        (filter === "netherlands" && `${match.homeTeam} ${match.awayTeam}`.toLowerCase().includes("netherlands")) ||
        (filter === "group" && match.stage === "group") ||
        (filter === "knockout" && match.stage !== "group") ||
        (filter === "finished" && match.status === "finished") ||
        (filter === "upcoming" && match.status !== "finished");
      const haystack = `${match.homeTeam} ${match.awayTeam} ${match.group ?? ""} ${match.roundLabel}`.toLowerCase();
      return byFilter && (!q || haystack.includes(q));
    });
  }, [data.matches, filter, query]);

  const grouped = useMemo(() => {
    const result = new Map<string, Match[]>();
    matches.forEach((match) => {
      const key = formatDutchDate(match.dateTimeLocal);
      result.set(key, [...(result.get(key) ?? []), match]);
    });
    return Array.from(result.entries());
  }, [matches]);

  return (
    <div>
      <PageHeader label="Speelschema" title="Alle wedstrijden" body="Filter, zoek en werk uitslagen bij. Alle tijden zijn Nederlandse tijden uit het schema." />

      <div className="sticky top-3 z-20 mb-6 rounded-2xl border border-white/10 bg-stadion-950/85 p-3 backdrop-blur-xl">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {filters.map(([value, label]) => (
              <Button key={value} variant={filter === value ? "primary" : "secondary"} onClick={() => setFilter(value)} className="shrink-0">
                {label}
              </Button>
            ))}
          </div>
          <label className="relative block min-w-0 xl:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Zoek team, poule of ronde"
              className="focus-ring w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm font-semibold text-white placeholder:text-slate-500"
            />
          </label>
        </div>
      </div>

      <div className="space-y-7">
        {grouped.map(([date, dateMatches]) => (
          <section key={date}>
            <h2 className="mb-3 text-lg font-black text-white">{date}</h2>
            <div className="grid gap-4 xl:grid-cols-2">
              {dateMatches.map((match) => (
                <MatchCard key={match.id} match={match} onEdit={setEditing} onOpenPool={(selected) => navigate(`/pool?match=${selected.id}`)} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <MatchEditorModal match={editing} onClose={() => setEditing(undefined)} onSave={data.updateMatch} />
    </div>
  );
};
