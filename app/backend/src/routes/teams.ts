// Libraries
import { Router } from 'express';

// Classes
import * as classes from '../classes/exporter';

// types
import * as types from '../types/exporter';

// Middleware
import { CommonMid } from '../middleware/exporter';

// Controller
import * as controller from '../controller/exporter';

export default class TeamRoute extends classes.Routes {
  // Paths
  private readonly pathId: types.routes.common.Id = '/:id';

  // router
  protected readonly _router: Router = Router();

  // controller
  protected readonly controller = new controller.TeamController();

  constructor() {
    super();
    this.initializeRoutes();
    this.errorHandler();
  }

  // getters
  get manager() { return this._router; }

  // methods
  protected initializeRoutes(): void {
    this.manager.get(this.root, this.controller.allTeams);

    this.manager.get(this.pathId, CommonMid.paramValidation, this.controller.teamById);
  }
}
