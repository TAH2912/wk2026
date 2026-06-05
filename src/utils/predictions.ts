import type { Match, Prediction, PredictionPool } from "../types";
import { getMatchWinner } from "./matches";

export const calculatePredictionPoints = (prediction: Prediction, match: Match) => {
  if (match.status !== "finished" || match.homeScore === undefined || match.awayScore === undefined) return undefined;

  const exact = prediction.homeScore === match.homeScore && prediction.awayScore === match.awayScore;
  if (exact) return 5;

  const actualDiff = match.homeScore - match.awayScore;
  const predictedDiff = prediction.homeScore - prediction.awayScore;
  const actualWinner = getMatchWinner(match) ?? "draw";
  const predictedWinner =
    prediction.homeScore > prediction.awayScore ? match.homeTeam : prediction.awayScore > prediction.homeScore ? match.awayTeam : "draw";

  if (actualWinner === "draw" && predictedWinner === "draw") return 2;
  if (actualWinner === predictedWinner && actualDiff === predictedDiff) return 3;
  if (actualWinner === predictedWinner) return 2;
  return 0;
};

export const hydratePoolPoints = (pool: PredictionPool, match?: Match): PredictionPool => {
  if (!match) return pool;
  const predictions = pool.predictions.map((prediction) => ({
    ...prediction,
    points: calculatePredictionPoints(prediction, match),
  }));
  return {
    ...pool,
    status: match.status === "finished" ? "finished" : pool.status,
    predictions,
  };
};

export const calculatePoolWinner = (pool: PredictionPool, match?: Match) => {
  const hydrated = hydratePoolPoints(pool, match);
  const max = Math.max(...hydrated.predictions.map((prediction) => prediction.points ?? -1));
  if (max < 0) return [];
  return hydrated.predictions.filter((prediction) => prediction.points === max);
};
