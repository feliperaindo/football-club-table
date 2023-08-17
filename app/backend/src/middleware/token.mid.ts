// types
import { Request, Response, NextFunction } from 'express';
import * as types from '../types/exporter';

// utils
import { validators, JWT } from '../utils/exporter';

export default class TokenMid {
  private static readonly unauthorized: types.Status = 401;

  public static authValidation(req: Request, __res: Response, next: NextFunction): void {
    try {
      validators.authorizationField(req.headers as types.user.Authorization);
    } catch (e) {
      const { message } = e as types.errors.ErrorType;
      const error: types.errors.ErrorHandler = { message, http: TokenMid.unauthorized };
      return next(error);
    }

    try {
      JWT.validateToken(req.headers.authorization as string);
      return next();
    } catch (__e) {
      const exception: types.errors.ErrorHandler = {
        http: TokenMid.unauthorized,
        message: 'Token must be a valid token',
      };
      return next(exception);
    }
  }
}
