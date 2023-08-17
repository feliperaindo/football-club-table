// Libraries
import { Router } from 'express';

// types
import * as types from '../types/exporter';

// Classes
import * as classes from '../classes/exporter';

// Middleware
import { LoginMid, TokenMid } from '../middleware/exporter';

// Controller
import * as controller from '../controller/exporter';

export default class LoginRoute extends classes.Routes {
  // paths
  private readonly role: types.routes.common.Role = '/role';

  // router
  protected _router: Router = Router();

  // controller
  protected controller = new controller.UserController();

  constructor() {
    super();
    this.controller.requireUserRole.bind(this);
    this.initializeRoutes();
    this.errorHandler();
  }

  // getters
  get manager() { return this._router; }

  // methods
  protected initializeRoutes(): void {
    this.manager.post(this.root, LoginMid.LoginValidation, this.controller.login);

    this.manager.get(this.role, TokenMid.authValidation, this.controller.requireUserRole);
  }
}
