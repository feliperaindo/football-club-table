// types
import * as types from '../types/exporter';
import * as model from '../database/models/exporter';

// classes
import * as classes from '../classes/exporter';

// utils
import * as utils from '../utils/exporter';

// repository
import * as repository from '../repository/exporter';

export default class UserService extends classes.Service {
  // repository
  protected repository = new repository.UserRepository();

  public async getToken(info: types.user.UserCreateToken): Promise<types.user.Token> {
    const user = await this.repository.getUser(info.email);

    if (user === null) {
      throw new Error('Invalid email or password');
    }

    const comparePassword = await utils.bcrypt.verifyPassword(info.password, user.password);

    if (!comparePassword) {
      throw new Error('Invalid email or password');
    }

    return { token: utils.JWT.generateToken(info) };
  }

  public async getRole(email: string): Promise<types.user.UserRole> {
    const user = await this.repository.getUser(email) as NonNullable<model.UserModel>;

    return { role: user.role };
  }
}
