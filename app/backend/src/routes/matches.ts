// Libraries
import { Router } from 'express';

// Classes
import * as classes from '../classes/exporter';

// Middleware
import { TokenMid, MatchMid, CommonMid } from '../middleware/exporter';

// Controller
import * as controller from '../controller/exporter';

export default class MatchRoute extends classes.Routes {
  // paths
  private readonly id: string = '/:id';
  private readonly finish: string = '/:id/finish';

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
    this.manager.get(this.root, this.controller.matchesByQuery);

    this.manager.patch(
      this.finish,
      TokenMid.authValidation,
      CommonMid.paramValidation,
      this.controller.endMatch,
    );

    this.manager.patch(
      this.id,
      TokenMid.authValidation,
      CommonMid.paramValidation,
      MatchMid.bodyValidation,
      this.controller.updateScore,
    );
  }
}
