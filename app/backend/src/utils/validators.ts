// types
import * as types from '../types/exporter';

// helpers
import checkers from '../helpers/checkers';

export default class Validators {
  private static readonly fieldError: string = 'All fields must be filled';
  private static readonly emailOrPasswordError: string = 'Invalid email or password';

  public static loginFields(body: types.user.UserCreateToken): void {
    type KeyBody = keyof types.user.UserCreateToken;

    ['password', 'email'].forEach((field) => {
      if (!checkers.checkKeys<types.user.UserCreateToken>(body, field)) {
        throw new Error(this.fieldError);
      }

      if (checkers.isEmpty(body[field as KeyBody])) {
        throw new Error(this.fieldError);
      }
    });
  }

  public static validateEmail(email: string): void {
    if (!checkers.checkEmail(email)) {
      throw new Error(this.emailOrPasswordError);
    }
  }

  public static validatePassword(password: string): void {
    if (!checkers.checkPassword(password)) {
      throw new Error(this.emailOrPasswordError);
    }
  }
}
