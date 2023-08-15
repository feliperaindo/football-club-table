export type TeamName = {
  teamName: string | undefined
};

export type MatchInfo = {
  id: number,
  homeTeamId: number,
  awayTeamId: number,
  inProgress: boolean,
  homeTeamGoals: number,
  awayTeamGoals: number,
  homeTeam: TeamName,
  awayTeam: TeamName
};
