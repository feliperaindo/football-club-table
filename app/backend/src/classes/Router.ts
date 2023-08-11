// Libraries
import { Router } from 'express';

// classes
import Controller from './controller';

// types
import * as types from '../types/routes/export';

export default abstract class Routes {
  protected readonly root: types.Root = '/';

  protected abstract _router: Router;

  protected abstract controller?: Controller;

  protected abstract errorHandler(): void;

  protected abstract initializeRoutes(): void;

  public abstract get manager(): Router;
}
