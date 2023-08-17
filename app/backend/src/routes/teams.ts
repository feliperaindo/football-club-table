// Libraries
import { Router, Request as Rq, Response as Rp, NextFunction as NF } from 'express';

// Classes
import * as classes from '../classes/exporter';

// types
import * as types from '../types/exporter';

// Middleware
import { ErrorMid, CommonMid } from '../middleware/exporter';

// Controller
import * as controller from '../controller/exporter';

export default class TeamRoute extends classes.Routes {
  // Paths
  private readonly pathId: types.routes.common.Id = '/:id';

  // router
  protected _router: Router = Router();

  // controller
  protected controller = new controller.TeamController();

  constructor() {
    super();
    this.initializeRoutes();
    this.errorHandler();
  }

  // getters
  get manager() { return this._router; }

  // methods
  protected initializeRoutes(): void {
    this.manager.get(this.root, (req: Rq, res: Rp) => this.controller.allTeams(req, res));

    this.manager.get(
      this.pathId,
      (req: Rq, res: Rp, next: NF) => CommonMid.paramValidation(req, res, next),
      (req: Rq, res: Rp, next: NF) => this.controller.teamById(req, res, next),
    );
  }

  protected errorHandler(): void {
    this.manager.use(ErrorMid.errorHandler);
  }
}
