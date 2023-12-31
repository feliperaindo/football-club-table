// libraries
import { Request, Response, NextFunction } from 'express';

// types
import * as types from '../types/exporter';

// utils
import { validators } from '../utils/exporter';

export default class LoginMid {
  private static badRequest: types.Status = 400;
  private static unauthorized: types.Status = 401;

  public static LoginValidation(req: Request, __res: Response, next: NextFunction): void {
    try {
      validators.loginFields(req.body);
    } catch (e) {
      const { message } = e as types.errors.ErrorType;
      const error: types.errors.ErrorHandler = { message, http: LoginMid.badRequest };
      return next(error);
    }

    try {
      validators.validateEmail(req.body.email);
      validators.validatePassword(req.body.password);
      return next();
    } catch (e) {
      const { message } = e as types.errors.ErrorType;
      const error: types.errors.ErrorHandler = { message, http: LoginMid.unauthorized };
      return next(error);
    }
  }
}
