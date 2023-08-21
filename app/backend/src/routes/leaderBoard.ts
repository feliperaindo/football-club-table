// Libraries
import { Router } from 'express';

// Classes
import * as classes from '../classes/exporter';

// Controller
import * as controller from '../controller/exporter';

export default class LeaderBoardRoute extends classes.Routes {
  // paths
  private readonly home: string = '/home';
  private readonly away: string = '/away';

  // router
  protected readonly _router: Router = Router();

  // controller
  protected controller = new controller.LeaderBoardController();

  constructor() {
    super();
    this.initializeRoutes();
    this.errorHandler();
  }

  // getters
  get manager() { return this._router; }

  // methods
  protected initializeRoutes(): void {
    this.manager.get(this.root, this.controller.requestLeaderBoard);
    this.manager.get(this.home, this.controller.requestHomeLeader);
    this.manager.get(this.away, this.controller.requestAwayLeader);
    this.manager.get('/test', controller.LeaderBoardController.meuTest);
  }
}
