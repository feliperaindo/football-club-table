type Binary = 0 | 1;

export type LeaderBoard = {
  name: string,
  totalPoints: string,
  totalGames: number,
  totalVictories: string,
  totalDraws: string,
  totalLosses: string,
  goalsFavor: string,
  goalsOwn: string,
  goalsBalance: string,
  efficiency: string
};

export type filter = 'home' | 'away' | undefined;

export type HashMap = Map<string, LeaderBoard>;

export type GoalInfo = { team: string, scored: number, taken: number };

export type ScoreBoard = { draw: Binary, victory: Binary, lose: Binary };
