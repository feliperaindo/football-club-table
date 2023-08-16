// Libraries
import { Router, Request, Response, NextFunction } from 'express';

// Classes
import * as classes from '../classes/exporter';

// Middleware
import { ErrorMid, TokenMid } from '../middleware/exporter';

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
    this.manager.get(this.root, (req: Request, res: Response) =>
      this.controller.matchesByQuery(req, res));

    this.manager.patch(
      this.finish,
      (req: Request, res: Response, next: NextFunction) =>
        TokenMid.authorizationValidation(req, res, next),
      (req: Request, res: Response, next: NextFunction) => this.controller.endMatch(req, res, next),
    );

    this.manager.patch(
      this.id,
      (req: Request, res: Response, next: NextFunction) =>
        TokenMid.authorizationValidation(req, res, next),
      (req: Request, res: Response, next: NextFunction) =>
        this.controller.updateScore(req, res, next),
    );
  }

  protected errorHandler(): void {
    this._router.use(ErrorMid.errorHandler);
  }
}
