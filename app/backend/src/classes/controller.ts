// types
import Service from './service';
import * as types from '../types/exporter';

export default abstract class Controller {
  protected abstract service: Service;
  protected readonly statusOk: types.Status = 200;
  protected readonly statusNotFound: types.Status = 404;
}
