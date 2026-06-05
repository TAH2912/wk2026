import type { Team } from "../types";
import { baseTeams } from "../data/mappers";

export type TeamIndex = Map<string, Team>;

/** Bouwt een opzoek-index op naam én genormaliseerde naam. */
export const buildTeamIndex = (teams: Team[]): TeamIndex => {
  const index: TeamIndex = new Map();
  teams.forEach((team) => {
    index.set(team.name.toLowerCase(), team);
    if (team.normalizedName) index.set(team.normalizedName.toLowerCase(), team);
  });
  return index;
};

/** Eén gedeelde index over alle deelnemende teams (uit worldcup_teams.json). */
export const teamIndex = buildTeamIndex(baseTeams);

export const findTeam = (name?: string) => (name ? teamIndex.get(name.toLowerCase()) : undefined);

/** Vlag-emoji bij een teamnaam; lege string voor placeholders/onbekende teams. */
export const teamFlag = (name?: string) => findTeam(name)?.flag ?? "";

export const isRealTeam = (name: string) => teamIndex.has(name.toLowerCase());
