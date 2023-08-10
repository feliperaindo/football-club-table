// types
import { Request, Response, NextFunction } from 'express';
import * as types from '../types/exporter';

export default class ErrorMid {
  static errorHandler(
    error: types.errors.ErrorHandler,
    __request: Request,
    response: Response,
    __next: NextFunction,
  ) {
    response.status(error.http).send({ message: error.message });
  }
}
