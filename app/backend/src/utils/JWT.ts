// libraries
import * as jwt from 'jsonwebtoken';

// types
import * as types from '../types/exporter';

export default class JWT {
  private static readonly config: jwt.SignOptions = { algorithm: 'HS256', expiresIn: '1h' };
  private static readonly secret: string = process.env.JWT_SECRET || 'jwt_secret';

  private static bearerRemover(bearerToken: string): string {
    return bearerToken.replace('Bearer ', '');
  }

  public static generateToken(info: types.user.UserCreateToken): string {
    return jwt.sign(info, this.secret, this.config);
  }

  public static decodeToken(bearerToken: string): types.user.UserCreateToken {
    const token = this.bearerRemover(bearerToken);
    return jwt.decode(token) as types.user.UserCreateToken;
  }

  public static validateToken(bearerToken: string): void {
    const token = this.bearerRemover(bearerToken);
    jwt.verify(token, this.secret, this.config);
  }
}
