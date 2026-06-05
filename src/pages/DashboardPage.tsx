import { CalendarDays, CheckCircle2, Clock, Trophy, Users } from "lucide-react";
import { Link } from "react-router-dom";
import type { AppDataContext } from "../useAppData";
import { Countdown } from "../components/Countdown";
import { MatchCard } from "../components/MatchCard";
import { StatCard } from "../components/StatCard";
import { Button } from "../components/Button";
import { calculateFriendsLeaderboard } from "../utils/leaderboard";
import { getNextMatch, getNextNetherlandsMatch } from "../utils/matches";

export const DashboardPage = ({ data }: { data: AppDataContext }) => {
  const nextMatch = getNextMatch(data.matches);
  const nextDutchMatch = getNextNetherlandsMatch(data.matches);
  const leaderboard = calculateFriendsLeaderboard(data.friends, data.pools, data.matches);
  const played = data.matches.filter((match) => match.status === "finished").length;
  const upcoming = data.matches.filter((match) => match.status !== "finished").length;
  const activePredictions = data.pools.reduce((sum, pool) => sum + pool.predictions.length, 0);

  return (
    <div>
      <section className="relative mb-8 overflow-hidden rounded-[2rem] border border-white/10 bg-stadion-900 p-5 shadow-card md:p-8">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,107,0,0.22),transparent_45%),radial-gradient(circle_at_85%_20%,rgba(56,189,248,0.18),transparent_36%)]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.06)_0_1px,transparent_1px_80px)] opacity-50" />
        <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-oranje-200">Live matchday screen</p>
            <h1 className="mt-4 font-display text-4xl font-black leading-tight text-white md:text-6xl">
              WK 2026 wedstrijdcentrum
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-200">
              Beheer uitslagen, poules en voorspellingen met een dashboard dat lekker op de bank, aan de bar en op groot scherm werkt.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/schedule"><Button icon={<CalendarDays size={18} />}>Speelschema</Button></Link>
              <Link to="/pool"><Button variant="secondary" icon={<Trophy size={18} />}>Pool starten</Button></Link>
            </div>
          </div>
          <div className="glass-strong p-5">
            <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-oranje-200">Volgende wedstrijd</p>
            {nextMatch ? <MatchCard match={nextMatch} compact /> : <p className="text-slate-300">Geen komende wedstrijd gevonden.</p>}
            <div className="mt-4">
              <Countdown target={nextMatch?.dateTimeLocal} />
            </div>
          </div>
        </div>
      </section>

      {nextDutchMatch ? (
        <section className="mb-8">
          <h2 className="mb-3 text-xl font-black text-white">Volgende wedstrijd van Nederland</h2>
          <MatchCard match={nextDutchMatch} compact />
        </section>
      ) : null}

      <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Gespeelde wedstrijden" value={played} icon={<CheckCircle2 />} accent="text-emerald-300" />
        <StatCard label="Komende wedstrijden" value={upcoming} icon={<Clock />} accent="text-sky-300" />
        <StatCard label="Actieve voorspellingen" value={activePredictions} icon={<Trophy />} />
        <StatCard label="Leider klassement" value={leaderboard[0]?.friend.name ?? "-"} icon={<Users />} accent="text-amber-300" />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["/groups", "Poules", "Bekijk actuele standen en beste nummers 3."],
          ["/knockout", "Knock-out", "Volg de route naar de finale."],
          ["/friends", "Vrienden", "Beheer je huiskamerpoule."],
          ["/leaderboard", "Klassement", "Wie heeft de meeste punten?"],
        ].map(([to, title, body]) => (
          <Link key={to} to={to} className="glass card-hover block p-5">
            <p className="text-xl font-black text-white">{title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">{body}</p>
          </Link>
        ))}
      </section>
    </div>
  );
};
