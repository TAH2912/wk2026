import { useEffect, useMemo, useState } from "react";
import { Plus, Save, Trophy } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import type { AppDataContext } from "../useAppData";
import type { Prediction, PredictionPool } from "../types";
import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { MatchCard } from "../components/MatchCard";
import { PageHeader } from "../components/PageHeader";
import { calculatePoolWinner, hydratePoolPoints } from "../utils/predictions";
import { getNextMatch } from "../utils/matches";

export const PredictionPoolPage = ({ data }: { data: AppDataContext }) => {
  const [params, setParams] = useSearchParams();
  const initialMatch = params.get("match") ?? getNextMatch(data.matches)?.id ?? data.matches[0]?.id;
  const [matchId, setMatchId] = useState(initialMatch);
  const match = data.matches.find((item) => item.id === matchId);
  const existingPool = data.pools.find((pool) => pool.matchId === matchId);
  const [draft, setDraft] = useState<PredictionPool>(() => createPool(matchId));

  useEffect(() => {
    setParams(matchId ? { match: matchId } : {});
    setDraft(existingPool ?? createPool(matchId));
  }, [existingPool, matchId, setParams]);

  const hydrated = useMemo(() => hydratePoolPoints(draft, match), [draft, match]);
  const winners = useMemo(() => calculatePoolWinner(draft, match), [draft, match]);

  const setPrediction = (friendId: string, values: Partial<Prediction>) => {
    setDraft((current) => {
      const exists = current.predictions.some((prediction) => prediction.friendId === friendId);
      const nextPrediction = { friendId, homeScore: 0, awayScore: 0, ...values };
      return {
        ...current,
        predictions: exists
          ? current.predictions.map((prediction) => (prediction.friendId === friendId ? { ...prediction, ...values } : prediction))
          : [...current.predictions, nextPrediction],
      };
    });
  };

  const addFriend = (friendId: string) => {
    if (!friendId) return;
    setPrediction(friendId, { homeScore: 0, awayScore: 0 });
  };

  if (!match) {
    return <EmptyState title="Geen wedstrijd gevonden" body="Het schema bevat nog geen wedstrijden om een pool voor te openen." />;
  }

  return (
    <div>
      <PageHeader label="Wedstrijdpool" title="Pool per wedstrijd" body="Voeg vrienden toe, vul voorspellingen in en laat de punten automatisch berekenen na de echte uitslag." />

      <div className="mb-5 grid gap-4 lg:grid-cols-[360px_1fr]">
        <div className="glass p-4">
          <label className="text-sm font-bold text-slate-300">Selecteer wedstrijd</label>
          <select className="focus-ring mt-2 w-full rounded-xl border border-white/10 bg-stadion-900 px-4 py-3 text-sm font-bold text-white" value={matchId} onChange={(event) => setMatchId(event.target.value)}>
            {data.matches.map((item) => (
              <option key={item.id} value={item.id}>{item.homeTeam} - {item.awayTeam}</option>
            ))}
          </select>
        </div>
        <MatchCard match={match} compact />
      </div>

      <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-bold text-slate-400">Poolstatus</p>
          <p className="text-xl font-black text-white">{hydrated.status === "open" ? "Pool open" : hydrated.status === "closed" ? "Pool gesloten" : "Punten berekend"}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select className="focus-ring rounded-xl border border-white/10 bg-stadion-900 px-4 py-3 text-sm font-bold text-white" onChange={(event) => addFriend(event.target.value)} value="">
            <option value="">Vriend toevoegen</option>
            {data.friends
              .filter((friend) => !draft.predictions.some((prediction) => prediction.friendId === friend.id))
              .map((friend) => <option key={friend.id} value={friend.id}>{friend.name}</option>)}
          </select>
          <Button variant="secondary" icon={<Plus size={16} />} onClick={() => data.upsertPool({ ...draft, status: "closed" })}>Sluit pool</Button>
          <Button icon={<Save size={16} />} onClick={() => data.upsertPool(hydrated)}>Opslaan</Button>
        </div>
      </div>

      {hydrated.status === "finished" && winners.length ? (
        <section className="relative mb-6 overflow-hidden rounded-[2rem] border border-oranje-300/40 bg-oranje-500/15 p-6 text-center shadow-glow">
          <Celebration />
          <Trophy className="mx-auto text-oranje-200" size={42} />
          <p className="mt-3 text-sm font-black uppercase tracking-[0.25em] text-oranje-100">Poolwinnaar</p>
          <h2 className="mt-2 text-4xl font-black text-white">
            {winners.map((winner) => data.friends.find((friend) => friend.id === winner.friendId)?.name).join(" & ")}
          </h2>
        </section>
      ) : null}

      {draft.predictions.length ? (
        <section className="grid gap-4 lg:grid-cols-2">
          {hydrated.predictions
            .slice()
            .sort((a, b) => (b.points ?? -1) - (a.points ?? -1))
            .map((prediction) => {
              const friend = data.friends.find((item) => item.id === prediction.friendId);
              if (!friend) return null;
              return (
                <article key={prediction.friendId} className="glass card-hover p-5">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-black text-white">{friend.name}</h3>
                      <p className="text-sm font-semibold text-slate-400">Voorspelling</p>
                    </div>
                    {prediction.points !== undefined ? <span className="rounded-full bg-oranje-500 px-3 py-1 text-sm font-black text-white">{prediction.points} pnt</span> : null}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="space-y-2">
                      <span className="text-sm font-bold text-slate-300">{match.homeTeam}</span>
                      <input className="num-input" type="number" min={0} value={prediction.homeScore} onChange={(event) => setPrediction(friend.id, { homeScore: Number(event.target.value) })} />
                    </label>
                    <label className="space-y-2">
                      <span className="text-sm font-bold text-slate-300">{match.awayTeam}</span>
                      <input className="num-input" type="number" min={0} value={prediction.awayScore} onChange={(event) => setPrediction(friend.id, { awayScore: Number(event.target.value) })} />
                    </label>
                  </div>
                </article>
              );
            })}
        </section>
      ) : (
        <EmptyState title="Nog geen voorspellingen" body="Voeg vrienden toe aan deze wedstrijdpool en sla daarna de voorspellingen op." />
      )}
    </div>
  );
};

const createPool = (matchId: string): PredictionPool => ({
  id: `pool-${matchId}`,
  matchId,
  predictions: [],
  status: "open",
  createdAt: new Date().toISOString(),
});

const Celebration = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    {Array.from({ length: 18 }).map((_, index) => (
      <span
        key={index}
        className="absolute top-0 h-2 w-2 animate-bounce rounded-full bg-oranje-300"
        style={{ left: `${(index * 17) % 100}%`, animationDelay: `${index * 0.08}s`, animationDuration: `${1 + (index % 4) * 0.2}s` }}
      />
    ))}
  </div>
);
