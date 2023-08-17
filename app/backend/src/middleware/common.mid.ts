// libraries
import { Request, Response, NextFunction } from 'express';

// types
import * as types from '../types/exporter';

// utils
import { validators } from '../utils/exporter';

export default class CommonMid {
  private static readonly badRequest: types.Status = 400;

  public static paramValidation(req: Request, __res: Response, next: NextFunction): void {
    try {
      validators.validateId(req.params.id);
      return next();
    } catch (e) {
      const { message } = e as types.errors.ErrorType;
      const error: types.errors.ErrorHandler = { message, http: CommonMid.badRequest };
      return next(error);
    }
  }
}
