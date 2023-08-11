// Libraries
import { Router } from 'express';

// Classes
import * as classes from '../classes/exporter';

// Routes
import TeamRoute from './exporter';

// types
import * as types from '../types/exporter';

export default class RouterManager extends classes.Routes {
  protected controller?: classes.Controller | undefined;

  // router
  protected _router: Router = Router();

  // routes names
  private readonly teams: types.routes.AllRoutes = '/teams';
  private readonly login: types.routes.AllRoutes = '/login';
  private readonly matches: types.routes.AllRoutes = '/matches';
  private readonly leaderBoard: types.routes.AllRoutes = '/leaderboard';

  // routers managers
  private team: TeamRoute = new TeamRoute();

  constructor() {
    super();
    this.initializeRoutes();
    this.errorHandler();
  }

  // getters
  get router() { return this._router; }

  // methods
  protected initializeRoutes(): void {
    // Do not remove this route | healthChecker
    this._router.get(this.root, (__req, res) => res.json({ ok: true }));

    // other routes
    this._router.use(this.teams, this.team.router);
    // this._router.use(this.login);
    // this._router.use(this.matches);
    // this._router.use(this.leaderBoard);
  }

  protected errorHandler(): void {
    this._router.get('test');
    // this._router.use();
  }
}
