// Libraries
import { Router, Request, Response, NextFunction } from 'express';

// Classes
import * as classes from '../classes/exporter';

// Middleware
import ErrorMid from '../middleware/error.mid';

// Controller
import * as controller from '../controller/exporter';

export default class LoginRoute extends classes.Routes {
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
      (req: Request, res: Response, next: NextFunction) => this.controller.login(req, res, next),
    );
  }

  protected errorHandler(): void {
    this._router.use(ErrorMid.errorHandler);
  }
}
