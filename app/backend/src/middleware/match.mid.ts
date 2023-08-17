// libraries
import { Request, Response, NextFunction } from 'express';

// types
import * as types from '../types/exporter';

// utils
import { validators } from '../utils/exporter';

export default class MatchMid {
  private static badRequest: types.Status = 400;
  private static unprocessableEntity: types.Status = 422;

  public static updateValidation(req: Request, __res: Response, next: NextFunction): void {
    try {
      validators.matchGoalFields(req.body);
      return next();
    } catch (e) {
      const { message } = e as types.errors.ErrorType;
      const error: types.errors.ErrorHandler = { message, http: MatchMid.badRequest };
      return next(error);
    }
  }

  public static registerValidation(req: Request, __res: Response, next:NextFunction): void {
    try {
      validators.newMatchFields(req.body);
    } catch (e) {
      const { message } = e as types.errors.ErrorType;
      const error: types.errors.ErrorHandler = { message, http: MatchMid.badRequest };
      return next(error);
    }

    try {
      const { awayTeamId, homeTeamId } = req.body as types.match.MatchPost;
      validators.validateSameTeam(homeTeamId, awayTeamId);
      return next();
    } catch (e) {
      const { message } = e as types.errors.ErrorType;
      const error: types.errors.ErrorHandler = { message, http: MatchMid.unprocessableEntity };
      return next(error);
    }
  }
}
