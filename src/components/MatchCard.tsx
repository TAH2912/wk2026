import { Edit3, MapPin, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import type { Match } from "../types";
import { formatDutchDate, formatDutchTime } from "../utils/date";
import { getMatchWinner, isPlaceholderTeam, teamDisplayLabel } from "../utils/matches";
import { teamFlag } from "../utils/teams";
import { Button } from "./Button";
import { StageBadge, StatusBadge } from "./Badge";

export const MatchCard = ({
  match,
  onEdit,
  onOpenPool,
  compact = false,
}: {
  match: Match;
  onEdit?: (match: Match) => void;
  onOpenPool?: (match: Match) => void;
  compact?: boolean;
}) => {
  const winner = getMatchWinner(match);
  const hasScore = match.homeScore !== undefined && match.awayScore !== undefined;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass card-hover overflow-hidden p-4 ${compact ? "" : "md:p-5"}`}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={match.status} />
          <StageBadge stage={match.stage} group={match.group} />
        </div>
        <p className="text-xs font-bold text-slate-400">
          {formatDutchDate(match.dateTimeLocal)} · {formatDutchTime(match.dateTimeLocal)}
        </p>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <TeamName team={match.homeTeam} active={winner === match.homeTeam} />
        <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-center">
          {hasScore ? (
            <p className="font-display text-3xl font-black text-white">
              {match.homeScore}-{match.awayScore}
            </p>
          ) : (
            <p className="font-display text-lg font-black text-slate-400">vs</p>
          )}
        </div>
        <TeamName team={match.awayTeam} active={winner === match.awayTeam} align="right" />
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-2 text-sm text-slate-300">
          <MapPin size={16} className="shrink-0 text-oranje-300" />
          <span className="truncate">{[match.venue, match.city].filter(Boolean).join(", ") || "Venue volgt"}</span>
        </div>
        <div className="flex gap-2">
          {onEdit ? <Button variant="secondary" icon={<Edit3 size={16} />} onClick={() => onEdit(match)}>Uitslag</Button> : null}
          {onOpenPool ? <Button icon={<Trophy size={16} />} onClick={() => onOpenPool(match)}>Pool</Button> : null}
        </div>
      </div>
    </motion.article>
  );
};

const TeamName = ({ team, active, align = "left" }: { team: string; active?: boolean; align?: "left" | "right" }) => {
  const placeholder = isPlaceholderTeam(team);
  const flag = teamFlag(team);
  return (
    <div className={`${align === "right" ? "text-right" : ""}`}>
      <p className={`flex items-center gap-2 text-base font-black md:text-xl ${align === "right" ? "justify-end" : ""} ${active ? "text-oranje-200" : placeholder ? "text-slate-300" : "text-white"}`}>
        {flag && align !== "right" ? <span className="text-2xl leading-none">{flag}</span> : null}
        <span>{teamDisplayLabel(team)}</span>
        {flag && align === "right" ? <span className="text-2xl leading-none">{flag}</span> : null}
      </p>
      {placeholder ? <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-500">nog te bepalen</p> : null}
    </div>
  );
};
