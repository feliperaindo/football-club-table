// types
import Repository from './repository';

export default abstract class Service {
  protected abstract readonly repository: Repository;
}
