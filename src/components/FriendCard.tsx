import { Edit3, Trash2 } from "lucide-react";
import type { Friend, LeaderboardRow } from "../types";
import { Button } from "./Button";

export const FriendCard = ({
  friend,
  stats,
  onEdit,
  onDelete,
}: {
  friend: Friend;
  stats?: LeaderboardRow;
  onEdit: (friend: Friend) => void;
  onDelete: (friendId: string) => void;
}) => (
  <article className="glass card-hover p-5">
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-black text-white" style={{ background: friend.color ?? "#ff6b00" }}>
          {friend.avatar || friend.name.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h3 className="text-xl font-black text-white">{friend.name}</h3>
          <p className="text-sm font-semibold text-slate-400">{friend.favoriteTeam || "Geen favoriet team"}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="secondary" icon={<Edit3 size={16} />} onClick={() => onEdit(friend)} />
        <Button variant="danger" icon={<Trash2 size={16} />} onClick={() => onDelete(friend.id)} />
      </div>
    </div>
    <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
      <MiniStat label="Punten" value={stats?.totalPoints ?? 0} />
      <MiniStat label="Voorspellingen" value={stats?.predictions ?? 0} />
      <MiniStat label="Exact" value={stats?.exactScores ?? 0} />
      <MiniStat label="Poolwinst" value={stats?.wonPools ?? 0} />
    </div>
  </article>
);

const MiniStat = ({ label, value }: { label: string; value: number }) => (
  <div className="rounded-xl bg-white/[0.04] p-3">
    <p className="text-lg font-black text-white">{value}</p>
    <p className="text-xs font-bold text-slate-400">{label}</p>
  </div>
);
