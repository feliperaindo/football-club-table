// libraries
import * as jwt from 'jsonwebtoken';

// types
import * as types from '../types/exporter';

export default class JWT {
  private readonly _secret: string;
  private readonly _config: jwt.SignOptions;

  constructor(secret?: string, config?: jwt.SignOptions) {
    this._secret = process.env.JWT_SECRET || secret || 'jwt_secret';
    this._config = config || { algorithm: 'HS256', expiresIn: '1h' };
  }

  get secret() { return this._secret; }
  get config() { return this._config; }

  public generateToken(info: types.user.UserCreateToken): string {
    return jwt.sign(info, this.secret, this.config);
  }
}
