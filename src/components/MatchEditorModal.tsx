import { useEffect, useState } from "react";
import { RotateCcw, Wand2, X } from "lucide-react";
import type { Match, MatchOverride, MatchStatus } from "../types";
import { Button } from "./Button";

export const MatchEditorModal = ({
  match,
  onClose,
  onSave,
  onRevert,
  isManual = false,
  autoFilled = false,
}: {
  match?: Match;
  onClose: () => void;
  onSave: (matchId: string, override: MatchOverride) => void;
  /** Verwijdert de handmatige invoer zodat de automatische uitslag weer telt. */
  onRevert?: (matchId: string) => void;
  /** Heeft deze wedstrijd een handmatige invoer? */
  isManual?: boolean;
  /** Is er een automatische uitslag beschikbaar voor deze wedstrijd? */
  autoFilled?: boolean;
}) => {
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");
  const [status, setStatus] = useState<MatchStatus>("scheduled");
  const [winner, setWinner] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!match) return;
    setHomeScore(match.homeScore?.toString() ?? "");
    setAwayScore(match.awayScore?.toString() ?? "");
    setStatus(match.status);
    setWinner(match.winner ?? "");
    setError("");
  }, [match]);

  if (!match) return null;

  const submit = () => {
    const home = homeScore === "" ? undefined : Number(homeScore);
    const away = awayScore === "" ? undefined : Number(awayScore);
    if ((home !== undefined && (!Number.isInteger(home) || home < 0)) || (away !== undefined && (!Number.isInteger(away) || away < 0))) {
      setError("Goals moeten hele getallen van 0 of hoger zijn.");
      return;
    }
    if (status === "finished" && (home === undefined || away === undefined)) {
      setError("Vul beide scores in om een wedstrijd als afgelopen op te slaan.");
      return;
    }
    onSave(match.id, { status, homeScore: home, awayScore: away, winner: winner || undefined });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="glass-strong w-full max-w-xl p-5 shadow-card">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-oranje-300">Uitslag invoeren</p>
            <h2 className="mt-2 text-2xl font-black text-white">{match.homeTeam} - {match.awayTeam}</h2>
          </div>
          <button className="focus-ring rounded-xl p-2 text-slate-300 hover:bg-white/10" onClick={onClose} aria-label="Sluiten">
            <X size={22} />
          </button>
        </div>

        {(autoFilled || isManual) && (
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-sky-300/20 bg-sky-400/10 px-4 py-3 text-sm text-sky-100">
            <Wand2 size={16} className="mt-0.5 shrink-0" />
            <span>
              {isManual
                ? "Je hebt deze uitslag handmatig ingevuld. Handmatige invoer heeft altijd voorrang op de automatische uitslag."
                : "Deze wedstrijd wordt automatisch bijgewerkt. Sla je hier iets op, dan wint jouw handmatige invoer."}
            </span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <label className="space-y-2">
            <span className="text-sm font-bold text-slate-300">{match.homeTeam}</span>
            <input className="num-input" type="number" min={0} value={homeScore} onChange={(event) => setHomeScore(event.target.value)} />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-bold text-slate-300">{match.awayTeam}</span>
            <input className="num-input" type="number" min={0} value={awayScore} onChange={(event) => setAwayScore(event.target.value)} />
          </label>
        </div>

        <label className="mt-4 block space-y-2">
          <span className="text-sm font-bold text-slate-300">Status</span>
          <select className="focus-ring w-full rounded-xl border border-white/10 bg-stadion-900 px-4 py-3 font-bold text-white" value={status} onChange={(event) => setStatus(event.target.value as MatchStatus)}>
            <option value="scheduled">Gepland</option>
            <option value="live">Bezig</option>
            <option value="finished">Afgelopen</option>
          </select>
        </label>

        {match.stage !== "group" ? (
          <label className="mt-4 block space-y-2">
            <span className="text-sm font-bold text-slate-300">Winnaar knock-out, optioneel</span>
            <select className="focus-ring w-full rounded-xl border border-white/10 bg-stadion-900 px-4 py-3 font-bold text-white" value={winner} onChange={(event) => setWinner(event.target.value)}>
              <option value="">Automatisch op basis van score</option>
              <option value={match.homeTeam}>{match.homeTeam}</option>
              <option value={match.awayTeam}>{match.awayTeam}</option>
            </select>
          </label>
        ) : null}

        {error ? <p className="mt-4 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm font-bold text-rose-100">{error}</p> : null}

        <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
          {isManual && onRevert ? (
            <Button
              variant="secondary"
              icon={<RotateCcw size={16} />}
              className="mr-auto"
              onClick={() => {
                onRevert(match.id);
                onClose();
              }}
            >
              Terug naar automatisch
            </Button>
          ) : null}
          <Button variant="ghost" onClick={onClose}>Annuleren</Button>
          <Button onClick={submit}>Opslaan</Button>
        </div>
      </div>
    </div>
  );
};
