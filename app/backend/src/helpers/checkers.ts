// types
import * as types from '../types/exporter';

export default class checkers {
  private static readonly empty: number = 0;
  private static readonly minPassword: number = 6;
  private static readonly emailRegex: RegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  private static readonly numberRegex: RegExp = /^\d+$/;

  public static checkKeys<T>(obj: T, key: string): boolean {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }

  public static isEmpty(value: string): boolean {
    return value.length === this.empty;
  }

  public static checkEmail(email: string): boolean {
    return this.emailRegex.test(email);
  }

  public static checkPassword(password: string): boolean {
    return password.length > this.minPassword;
  }

  public static checkOnlyNumbers(id: string): boolean {
    return this.numberRegex.test(id);
  }

  public static checkWinner(scored: number, taken: number): types.Leader.ScoreBoard {
    switch (true) {
      case (scored > taken): return { draw: 0, lose: 0, victory: 1 };
      case (scored < taken): return { draw: 0, lose: 1, victory: 0 };
      default: return { draw: 1, lose: 0, victory: 0 };
    }
  }

  public static sortLeaderBoard(table: types.Leader.LeaderBoard[]): types.Leader.LeaderBoard[] {
    return table.sort((f, s) => {
      const diffPoints = s.totalPoints - f.totalPoints;
      if (diffPoints !== 0) { return diffPoints; }

      const diffBalance = s.goalsBalance - f.goalsBalance;
      if (diffBalance !== 0) { return diffBalance; }

      return s.goalsFavor - f.goalsFavor;
    });
  }
}
