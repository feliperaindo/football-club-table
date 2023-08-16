// Libraries
import { Router, Request, Response } from 'express';

// Classes
import * as classes from '../classes/exporter';

// Middleware
import ErrorMid from '../middleware/error.mid';

// Controller
import * as controller from '../controller/exporter';

export default class MatchRoute extends classes.Routes {
  // router
  protected _router: Router = Router();

  // controller
  protected controller = new controller.MatchController();

  constructor() {
    super();
    this.initializeRoutes();
    this.errorHandler();
  }

  // getters
  get manager() { return this._router; }

  // methods
  protected initializeRoutes(): void {
    this.manager.get(
      this.root,
      (req: Request, res: Response) => this.controller.matchesByQuery(req, res),
    );
  }

  protected errorHandler(): void {
    this._router.use(ErrorMid.errorHandler);
  }
}
