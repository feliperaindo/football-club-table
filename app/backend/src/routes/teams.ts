// Libraries
import { Router, Request, Response, NextFunction } from 'express';

// Classes
import * as classes from '../classes/exporter';

// types
import * as types from '../types/exporter';

// Middleware
import ErrorMid from '../middleware/error.mid';

// Controller
import TeamController from '../controller/exporter';

export default class TeamRoute extends classes.Routes {
  // Paths
  private readonly pathId: types.routes.common.Id = '/:id';

  // router
  protected _router: Router = Router();

  // controller
  protected controller = new TeamController();

  constructor() {
    super();
    this.initializeRoutes();
    this.errorHandler();
  }

  // getters
  get router() { return this._router; }

  // methods
  protected initializeRoutes(): void {
    this.router.get(
      this.root,
      (req: Request, res: Response) => this.controller.allTeams(req, res),
    );

    this.router.get(
      this.pathId,
      (
        req: Request,
        res: Response,
        next: NextFunction,
      ) => this.controller.teamById(req, res, next),
    );
  }

  protected errorHandler(): void {
    this._router.use(ErrorMid.errorHandler);
  }
}
