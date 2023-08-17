// Libraries
import { Router, Request as Rq, Response as Rp, NextFunction as NF } from 'express';

// types
import * as types from '../types/exporter';

// Classes
import * as classes from '../classes/exporter';

// Middleware
import { ErrorMid, LoginMid, TokenMid } from '../middleware/exporter';

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
    this.initializeRoutes();
    this.errorHandler();
  }

  // getters
  get manager() { return this._router; }

  // methods
  protected initializeRoutes(): void {
    this.manager.post(
      this.root,
      (req: Rq, res: Rp, next: NF) => LoginMid.LoginValidation(req, res, next),
      (req: Rq, res: Rp, next: NF) => this.controller.login(req, res, next),
    );

    this.manager.get(
      this.role,
      (req: Rq, res: Rp, next: NF) => TokenMid.authValidation(req, res, next),
      (req: Rq, res: Rp) => this.controller.requireUserRole(req, res),
    );
  }

  protected errorHandler(): void {
    this.manager.use(ErrorMid.errorHandler);
  }
}
