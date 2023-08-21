// types
import * as types from '../types/exporter';

// helpers
import checkers from './checkers';

export default class TableTools {
  private static readonly zero: number = 0;
  private static readonly hundred: number = 100;
  private static readonly winnerPoints: number = 3;

  // creator
  public static leaderObjCreator(teamName: string): types.Leader.LeaderBoard {
    return {
      name: teamName,
      totalPoints: this.zero,
      totalGames: this.zero,
      totalVictories: this.zero,
      totalDraws: this.zero,
      totalLosses: this.zero,
      goalsFavor: this.zero,
      goalsOwn: this.zero,
      goalsBalance: this.zero,
      efficiency: '0',
    };
  }

  // sorts
  public static sortLeaderBoard(table: types.Leader.LeaderBoard[]): types.Leader.LeaderBoard[] {
    return table.sort((f, s) => {
      const diffPoints = s.totalPoints - f.totalPoints;
      if (diffPoints !== this.zero) { return diffPoints; }

      const diffVictories = s.totalVictories - f.totalVictories;
      if (diffVictories !== this.zero) { return diffVictories; }

      const diffBalance = s.goalsBalance - f.goalsBalance;
      if (diffBalance !== this.zero) { return diffBalance; }

      return s.goalsFavor - f.goalsFavor;
    });
  }

  // Updaters
  public static updateGoalsScore(
    hashMap: types.Leader.HashMap,
    info: types.Leader.GoalInfo,
  ): void {
    const { team, scored, taken } = info;
    const oldInfo = hashMap.get(team) as types.Leader.LeaderBoard;
    hashMap.set(
      team,
      { ...oldInfo,
        goalsFavor: oldInfo.goalsFavor + scored,
        goalsOwn: oldInfo.goalsOwn + taken,
      },
    );
  }

  public static updateTotalGames(
    hashMap: types.Leader.HashMap,
    info: types.Leader.GoalInfo,
  ): void {
    const { team, scored, taken } = info;
    const { draw, victory, lose } = checkers.checkWinner(scored, taken);
    const oldInfo = hashMap.get(team) as types.Leader.LeaderBoard;
    hashMap.set(
      team,
      { ...oldInfo,
        totalGames: oldInfo.totalGames + 1,
        totalLosses: oldInfo.totalLosses + lose,
        totalDraws: oldInfo.totalDraws + draw,
        totalVictories: oldInfo.totalVictories + victory,
      },
    );
  }

  public static updatePointsAndGoalsBalance(hashMap: types.Leader.HashMap, team: string): void {
    const oldInfo = hashMap.get(team) as types.Leader.LeaderBoard;
    hashMap.set(
      team,
      { ...oldInfo,
        totalPoints: ((oldInfo.totalVictories * this.winnerPoints) + oldInfo.totalDraws),
        goalsBalance: (oldInfo.goalsFavor - oldInfo.goalsOwn),
      },
    );
  }

  public static updateEfficiency(hashMap: types.Leader.HashMap, team: string): void {
    const oldInfo = hashMap.get(team) as types.Leader.LeaderBoard;
    hashMap.set(
      team,
      { ...oldInfo,
        efficiency: (
          (oldInfo.totalPoints / (oldInfo.totalGames * this.winnerPoints)) * this.hundred)
          .toFixed(2)
          .toString(),
      },
    );
  }
}
