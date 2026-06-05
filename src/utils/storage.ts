import type { AppDataExport, Friend, MatchOverride, PredictionPool } from "../types";

export const STORAGE_KEYS = {
  matchOverrides: "wk2026.matchOverrides",
  friends: "wk2026.friends",
  pools: "wk2026.pools",
} as const;

const read = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const write = <T>(key: string, value: T) => localStorage.setItem(key, JSON.stringify(value));

export const loadMatchOverrides = () => read<Record<string, MatchOverride>>(STORAGE_KEYS.matchOverrides, {});
export const saveMatchOverrides = (value: Record<string, MatchOverride>) => write(STORAGE_KEYS.matchOverrides, value);

export const loadFriends = () =>
  read<Friend[]>(STORAGE_KEYS.friends, [
    { id: "friend-1", name: "Thomas", favoriteTeam: "Netherlands", avatar: "TH", color: "#ff6b00" },
    { id: "friend-2", name: "Nimke", favoriteTeam: "Brazil", avatar: "NI", color: "#22c55e" },
  ]);
export const saveFriends = (value: Friend[]) => write(STORAGE_KEYS.friends, value);

export const loadPools = () => read<PredictionPool[]>(STORAGE_KEYS.pools, []);
export const savePools = (value: PredictionPool[]) => write(STORAGE_KEYS.pools, value);

export const clearAppStorage = () => Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));

export const exportAppData = (): AppDataExport => ({
  version: 1,
  exportedAt: new Date().toISOString(),
  matchOverrides: loadMatchOverrides(),
  friends: loadFriends(),
  pools: loadPools(),
});

export const importAppData = (data: AppDataExport) => {
  if (data.version !== 1 || !Array.isArray(data.friends) || !Array.isArray(data.pools) || typeof data.matchOverrides !== "object") {
    throw new Error("Ongeldig exportbestand.");
  }
  saveMatchOverrides(data.matchOverrides);
  saveFriends(data.friends);
  savePools(data.pools);
};
