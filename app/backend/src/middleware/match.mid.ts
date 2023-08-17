// libraries
import { Request, Response, NextFunction } from 'express';

// types
import * as types from '../types/exporter';

// utils
import { validators } from '../utils/exporter';

export default class MatchMid {
  private static badRequest: types.Status = 400;

  public static bodyValidation(req: Request, __res: Response, next: NextFunction): void {
    try {
      validators.matchGoalFields(req.body);
      return next();
    } catch (e) {
      const { message } = e as types.errors.ErrorType;
      const error: types.errors.ErrorHandler = { message, http: this.badRequest };
      return next(error);
    }
  }
}
