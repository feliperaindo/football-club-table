// types
import Service from './service';
import * as types from '../types/exporter';

export default abstract class Controller {
  protected readonly ok: types.Status = 200;
  protected readonly created: types.Status = 201;
  protected readonly notFound: types.Status = 404;
  protected readonly unauthorized: types.Status = 401;
  protected abstract readonly service: Service;
}
