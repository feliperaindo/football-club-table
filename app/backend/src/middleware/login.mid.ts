// libraries
import { Request, Response, NextFunction } from 'express';

// types
import * as types from '../types/exporter';

// utils
import { validators } from '../utils/exporter';

export default class LoginMid {
  private static statusBadRequest: types.Status = 400;

  public static LoginValidation(req: Request, __res: Response, next: NextFunction): void {
    try {
      validators.loginFields(req.body);
      next();
    } catch (e) {
      const { message } = e as types.errors.ErrorType;
      const error: types.errors.ErrorHandler = { message, http: this.statusBadRequest };
      next(error);
    }
  }
}
