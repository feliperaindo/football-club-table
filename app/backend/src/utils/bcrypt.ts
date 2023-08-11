// libraries
import * as bcrypt from 'bcryptjs';

export default class Bcrypt {
  private static readonly salts: number = Number(process.env.SALTS) || 10;

  public static verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
