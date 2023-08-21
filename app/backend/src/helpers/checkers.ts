// types
import * as types from '../types/exporter';

export default class checkers {
  private static readonly one = 1;
  private static readonly zero = 0;
  private static readonly minPassword: number = 6;
  private static readonly emailRegex: RegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  private static readonly numberRegex: RegExp = /^\d+$/;

  public static checkKeys<T>(obj: T, key: string): boolean {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }

  public static isEmpty(value: string): boolean {
    return value.length === this.zero;
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
      case (scored > taken): return { draw: this.zero, lose: this.zero, victory: this.one };
      case (scored < taken): return { draw: this.zero, lose: this.one, victory: this.zero };
      default: return { draw: this.one, lose: this.zero, victory: this.zero };
    }
  }
}
