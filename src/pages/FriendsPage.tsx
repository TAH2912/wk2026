import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import type { AppDataContext } from "../useAppData";
import type { Friend } from "../types";
import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { FriendCard } from "../components/FriendCard";
import { PageHeader } from "../components/PageHeader";
import { calculateFriendsLeaderboard } from "../utils/leaderboard";

const colors = ["#ff6b00", "#2563eb", "#22c55e", "#e11d48", "#a855f7", "#f59e0b"];

export const FriendsPage = ({ data }: { data: AppDataContext }) => {
  const [editing, setEditing] = useState<Friend>();
  const leaderboard = useMemo(() => calculateFriendsLeaderboard(data.friends, data.pools, data.matches), [data.friends, data.pools, data.matches]);

  return (
    <div>
      <PageHeader label="Vrienden" title="Vrienden beheren" body="Maak je huiskamerpoule persoonlijk met favoriete teams, kleuren en statistieken." action={<Button icon={<Plus size={16} />} onClick={() => setEditing(blankFriend())}>Vriend toevoegen</Button>} />
      {data.friends.length ? (
        <section className="grid gap-4 lg:grid-cols-2">
          {data.friends.map((friend) => (
            <FriendCard key={friend.id} friend={friend} stats={leaderboard.find((row) => row.friend.id === friend.id)} onEdit={setEditing} onDelete={data.deleteFriend} />
          ))}
        </section>
      ) : (
        <EmptyState title="Nog geen vrienden" body="Voeg vrienden toe om voorspellingen en klassementen te gebruiken." action={<Button onClick={() => setEditing(blankFriend())}>Vriend toevoegen</Button>} />
      )}
      {editing ? <FriendEditor friend={editing} teams={data.teams.map((team) => team.name)} onClose={() => setEditing(undefined)} onSave={(friend) => { data.upsertFriend(friend); setEditing(undefined); }} /> : null}
    </div>
  );
};

const blankFriend = (): Friend => ({ id: crypto.randomUUID(), name: "", avatar: "", color: colors[0] });

const FriendEditor = ({
  friend,
  teams,
  onClose,
  onSave,
}: {
  friend: Friend;
  teams: string[];
  onClose: () => void;
  onSave: (friend: Friend) => void;
}) => {
  const [draft, setDraft] = useState(friend);
  const [error, setError] = useState("");
  const submit = () => {
    if (!draft.name.trim()) {
      setError("Vul een naam in.");
      return;
    }
    onSave({ ...draft, name: draft.name.trim(), avatar: draft.avatar || draft.name.slice(0, 2).toUpperCase() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="glass-strong w-full max-w-lg p-5">
        <h2 className="text-2xl font-black text-white">Vriend</h2>
        <label className="mt-4 block space-y-2">
          <span className="text-sm font-bold text-slate-300">Naam</span>
          <input className="focus-ring w-full rounded-xl border border-white/10 bg-stadion-900 px-4 py-3 font-bold text-white" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
        </label>
        <label className="mt-4 block space-y-2">
          <span className="text-sm font-bold text-slate-300">Favoriet team</span>
          <select className="focus-ring w-full rounded-xl border border-white/10 bg-stadion-900 px-4 py-3 font-bold text-white" value={draft.favoriteTeam ?? ""} onChange={(event) => setDraft({ ...draft, favoriteTeam: event.target.value || undefined })}>
            <option value="">Geen favoriet</option>
            {teams.map((team) => <option key={team} value={team}>{team}</option>)}
          </select>
        </label>
        <label className="mt-4 block space-y-2">
          <span className="text-sm font-bold text-slate-300">Avatar tekst</span>
          <input className="focus-ring w-full rounded-xl border border-white/10 bg-stadion-900 px-4 py-3 font-bold text-white" maxLength={3} value={draft.avatar ?? ""} onChange={(event) => setDraft({ ...draft, avatar: event.target.value.toUpperCase() })} />
        </label>
        <div className="mt-4 flex gap-2">
          {colors.map((color) => (
            <button key={color} className={`h-10 w-10 rounded-xl border-2 ${draft.color === color ? "border-white" : "border-transparent"}`} style={{ background: color }} onClick={() => setDraft({ ...draft, color })} aria-label={`Kleur ${color}`} />
          ))}
        </div>
        {error ? <p className="mt-4 text-sm font-bold text-rose-200">{error}</p> : null}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>Annuleren</Button>
          <Button onClick={submit}>Opslaan</Button>
        </div>
      </div>
    </div>
  );
};
