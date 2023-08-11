// libraries
import * as jwt from 'jsonwebtoken';

// types
import * as types from '../types/exporter';

export default class JWT {
  private static readonly config: jwt.SignOptions = { algorithm: 'HS256', expiresIn: '1h' };
  private static readonly secret: string = process.env.JWT_SECRET || 'jwt_secret';

  public static generateToken(info: types.user.UserCreateToken): string {
    return jwt.sign(info, this.secret, this.config);
  }
}
