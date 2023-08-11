// interfaces
import * as interfaces from '../interfaces/exporter';

// classes
import * as classes from '../classes/exporter';

// Model
import * as model from '../database/models/exporter';

export default class UserRepository extends classes.Repository
  implements interfaces.IUserRepository<model.UserModel> {
  protected model = model.UserModel;

  public async getUser(email: string): Promise<model.UserModel | null> {
    return this.model.findOne({ where: { email } });
  }
}
