export default class checkers {
  private static readonly empty: number = 0;
  private static readonly minPassword: number = 6;
  private static readonly emailRegex: RegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

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
}
