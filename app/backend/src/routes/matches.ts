// Libraries
import { Router, Request as Rq, Response as Rp, NextFunction as NF } from 'express';

// Classes
import * as classes from '../classes/exporter';

// Middleware
import { ErrorMid, TokenMid, MatchMid, CommonMid } from '../middleware/exporter';

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
    this.manager.get(this.root, (req: Rq, res: Rp) => this.controller.matchesByQuery(req, res));

    this.manager.use(TokenMid.authValidation, CommonMid.paramValidation);

    this.manager.patch(
      this.finish,
      (req: Rq, res: Rp, next: NF) => this.controller.endMatch(req, res, next),
    );

    this.manager.patch(
      this.id,
      (req: Rq, res: Rp, next: NF) => MatchMid.bodyValidation(req, res, next),
      (req: Rq, res: Rp, next: NF) => this.controller.updateScore(req, res, next),
    );
  }

  protected errorHandler(): void {
    this.manager.use(ErrorMid.errorHandler);
  }
}
