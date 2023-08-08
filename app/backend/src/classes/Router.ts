// Libraries
import { Router } from 'express';

// types
import * as types from '../types/routes/export';

export default abstract class Routes {
  protected readonly root: types.Root = '/';

  protected abstract _router: Router;

  protected abstract controller: number;

  protected abstract errorHandler(): void;

  protected abstract initializeRoutes(): void;
}
