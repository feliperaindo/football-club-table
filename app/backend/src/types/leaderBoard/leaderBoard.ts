type Binary = 0 | 1;

export type LeaderBoard = {
  name: string,
  totalPoints: number,
  totalGames: number,
  totalVictories: number,
  totalDraws: number,
  totalLosses: number,
  goalsFavor: number,
  goalsOwn: number,
  goalsBalance: number,
  efficiency: string
};

export type HashMap = Map<string, LeaderBoard>;

export type GoalInfo = { team: string, scored: number, taken: number };

export type ScoreBoard = { draw: Binary, victory: Binary, lose: Binary };
