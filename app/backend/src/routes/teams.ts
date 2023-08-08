// Libraries
import { Router } from 'express';

// Classes
import Routes from '../classes/exporter';

// types
// import * as types from '../types/routes/root';

export default class TeamRoute extends Routes {
  // router
  protected _router: Router = Router();

  // controller
  protected controller = 5;

  constructor() {
    super();
    this.initializeRoutes();
    this.errorHandler();
  }

  // getters
  get router() { return this._router; }

  // methods
  protected initializeRoutes(): void {
    this._router.get(this.root);
  }

  protected errorHandler(): void {
    this._router.get('test');
    // this._router.use();
  }
}
