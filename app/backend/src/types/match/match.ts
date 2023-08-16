export type TeamName = {
  teamName: string | undefined
};

export type GoalsUpdate = {
  homeTeamGoals: number,
  awayTeamGoals: number
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

export type UpdateMatchStatus = [affectedCount: number];

export type SuccessUpdate = { message: string };
