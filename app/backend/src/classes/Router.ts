// Libraries
import { Router } from 'express';

// classes
import Controller from './controller';

// middleware
import { ErrorMid } from '../middleware/exporter';

// types
import * as types from '../types/routes/export';

export default abstract class Routes {
  protected readonly root: types.Root = '/';

  protected abstract _router: Router;

  protected abstract controller?: Controller;

  protected abstract initializeRoutes(): void;

  public abstract get manager(): Router;

  protected errorHandler(): void { this.manager.use(ErrorMid.errorHandler); }
}
