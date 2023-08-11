// libraries
import * as bcrypt from 'bcryptjs';

export default class Bcrypt {
  private readonly salts: number;

  constructor(setSalts?: number) {
    const defaultSalts = 10;
    const envSalts = Bcrypt.checkEnvSalts();

    if (envSalts) {
      this.salts = Number(process.env.SALTS);
    } else {
      this.salts = setSalts || defaultSalts;
    }
  }

  private static checkEnvSalts(): boolean {
    const salts = process.env.SALTS;
    const regex = /^\d+$/;

    if (salts === undefined || salts === null) {
      return false;
    }

    return regex.test(salts);
  }

  public static verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
