// libraries
import { Response, Request, NextFunction } from 'express';

// types
import * as types from '../types/exporter';

// classes
import * as classes from '../classes/exporter';

// service
import * as service from '../service/exporter';

export default class UserController extends classes.Controller {
  protected service = new service.UserService();

  public async login(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const token = await this.service.getToken(request.body);
      response.status(this.ok).send(token);
    } catch (e) {
      const { message } = e as types.errors.ErrorType;
      const error: types.errors.ErrorHandler = { message, http: this.unauthorized };
      next(error);
    }
  }
}
