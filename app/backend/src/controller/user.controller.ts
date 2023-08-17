// libraries
import { Response, Request, NextFunction } from 'express';

// types
import * as types from '../types/exporter';

// classes
import * as classes from '../classes/exporter';

// utils
import * as utils from '../utils/exporter';

// service
import * as service from '../service/exporter';

export default class UserController extends classes.Controller {
  protected readonly service = new service.UserService();

  constructor() {
    super();
    this.login = this.login.bind(this);
    this.requireUserRole = this.requireUserRole.bind(this);
  }

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

  public async requireUserRole(request: Request, response: Response): Promise<void> {
    const { email } = utils.JWT.decodeToken(request.headers.authorization as string);
    const result = await this.service.getRole(email);
    response.status(this.ok).send(result);
  }
}
