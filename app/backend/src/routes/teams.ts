// Libraries
import { Router, Request, Response } from 'express';

// Classes
import * as classes from '../classes/exporter';

// Controller
import TeamController from '../controller/exporter';

export default class TeamRoute extends classes.Routes {
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
    this._router.get(
      this.root,
      (req: Request, res: Response) => this.controller.allTeams(req, res),
    );
  }

  protected errorHandler(): void {
    this._router.get('test');
    // this._router.use();
  }
}
