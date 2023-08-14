// libraries
import { Request, Response, NextFunction } from 'express';

// types
import * as types from '../types/exporter';

// utils
import { validators, JWT } from '../utils/exporter';

export default class LoginMid {
  private static badRequest: types.Status = 400;
  private static unauthorized: types.Status = 401;

  public static LoginValidation(req: Request, __res: Response, next: NextFunction): void {
    try {
      validators.loginFields(req.body);
    } catch (e) {
      const { message } = e as types.errors.ErrorType;
      const error: types.errors.ErrorHandler = { message, http: this.badRequest };
      return next(error);
    }

    try {
      validators.validateEmail(req.body.email);
      validators.validatePassword(req.body.password);
      return next();
    } catch (e) {
      const { message } = e as types.errors.ErrorType;
      const error: types.errors.ErrorHandler = { message, http: this.unauthorized };
      return next(error);
    }
  }

  public static authorizationValidation(req: Request, __res: Response, next: NextFunction): void {
    try {
      validators.authorizationField(req.headers as types.user.Authorization);
    } catch (e) {
      const { message } = e as types.errors.ErrorType;
      const error: types.errors.ErrorHandler = { message, http: this.unauthorized };
      return next(error);
    }

    try {
      JWT.validateToken(req.headers.authorization as string);
      return next();
    } catch (__e) {
      const exception: types.errors.ErrorHandler = {
        http: this.unauthorized,
        message: 'Token must be a valid token',
      };
      return next(exception);
    }
  }
}
