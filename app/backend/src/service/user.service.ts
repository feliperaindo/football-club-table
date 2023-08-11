// types
import * as types from '../types/exporter';

// classes
import * as classes from '../classes/exporter';

// utils
import * as utils from '../utils/exporter';

// repository
import * as repository from '../repository/exporter';

export default class UserService extends classes.Service {
  // repository
  protected repository = new repository.UserRepository();

  // utils
  private jwt = new utils.JWT();

  public async getToken(info: types.user.UserCreateToken): Promise<types.user.Token> {
    const user = await this.repository.getUser(info.email);

    if (user === null) {
      throw new Error('Invalid email or password');
    }

    const comparePassword = await utils.bcrypt.verifyPassword(info.password, user.password);

    if (!comparePassword) {
      throw new Error('Invalid email or password');
    }

    return { token: this.jwt.generateToken(info) };
  }
}
