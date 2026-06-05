import type { Friend, LeaderboardRow, Match, PredictionPool } from "../types";
import { calculatePoolWinner, hydratePoolPoints } from "./predictions";

export const calculateFriendsLeaderboard = (friends: Friend[], pools: PredictionPool[], matches: Match[]): LeaderboardRow[] => {
  const rows = friends.map((friend) => ({
    friend,
    totalPoints: 0,
    predictions: 0,
    exactScores: 0,
    wonPools: 0,
    averagePoints: 0,
  }));

  const byFriend = new Map(rows.map((row) => [row.friend.id, row]));
  const byMatch = new Map(matches.map((match) => [match.id, match]));

  pools.forEach((pool) => {
    const match = byMatch.get(pool.matchId);
    const hydrated = hydratePoolPoints(pool, match);
    const winners = calculatePoolWinner(pool, match).map((prediction) => prediction.friendId);

    hydrated.predictions.forEach((prediction) => {
      const row = byFriend.get(prediction.friendId);
      if (!row || prediction.points === undefined) return;
      row.predictions += 1;
      row.totalPoints += prediction.points;
      if (prediction.points === 5) row.exactScores += 1;
      if (winners.includes(prediction.friendId)) row.wonPools += 1;
    });
  });

  return rows
    .map((row) => ({ ...row, averagePoints: row.predictions ? row.totalPoints / row.predictions : 0 }))
    .sort(
      (a, b) =>
        b.totalPoints - a.totalPoints ||
        b.exactScores - a.exactScores ||
        b.wonPools - a.wonPools ||
        a.friend.name.localeCompare(b.friend.name, "nl"),
    );
};
