import type { Group, GroupStandingRow, Match } from "../types";

const blankRow = (team: string, group: string): GroupStandingRow => ({
  team,
  group,
  played: 0,
  won: 0,
  drawn: 0,
  lost: 0,
  goalsFor: 0,
  goalsAgainst: 0,
  goalDifference: 0,
  points: 0,
});

export const sortStandings = (rows: GroupStandingRow[]) =>
  [...rows].sort(
    (a, b) =>
      b.points - a.points ||
      b.goalDifference - a.goalDifference ||
      b.goalsFor - a.goalsFor ||
      a.team.localeCompare(b.team, "nl"),
  );

export const calculateGroupStandings = (matches: Match[], groups: Group[]) => {
  const table = new Map<string, GroupStandingRow[]>();

  groups.forEach((group) => {
    table.set(
      group.name,
      group.teams.map((team) => blankRow(team, group.name)),
    );
  });

  matches
    .filter((match) => match.stage === "group" && match.status === "finished")
    .forEach((match) => {
      if (match.homeScore === undefined || match.awayScore === undefined || !match.group) return;
      const rows = table.get(match.group);
      if (!rows) return;
      const home = rows.find((row) => row.team === match.homeTeam);
      const away = rows.find((row) => row.team === match.awayTeam);
      if (!home || !away) return;

      home.played += 1;
      away.played += 1;
      home.goalsFor += match.homeScore;
      home.goalsAgainst += match.awayScore;
      away.goalsFor += match.awayScore;
      away.goalsAgainst += match.homeScore;

      if (match.homeScore > match.awayScore) {
        home.won += 1;
        away.lost += 1;
        home.points += 3;
      } else if (match.awayScore > match.homeScore) {
        away.won += 1;
        home.lost += 1;
        away.points += 3;
      } else {
        home.drawn += 1;
        away.drawn += 1;
        home.points += 1;
        away.points += 1;
      }

      home.goalDifference = home.goalsFor - home.goalsAgainst;
      away.goalDifference = away.goalsFor - away.goalsAgainst;
    });

  return Array.from(table.entries()).map(([group, rows]) => ({ group, rows: sortStandings(rows) }));
};

export const calculateBestThirdPlacedTeams = (standings: ReturnType<typeof calculateGroupStandings>) =>
  sortStandings(standings.map((group) => group.rows[2]).filter(Boolean)).map((row, index) => ({
    ...row,
    rank: index + 1,
    status: index < 8 ? "voorlopig door" : "voorlopig uitgeschakeld",
  }));
