// types
import * as types from '../types/exporter';

// helpers
import checkers from '../helpers/checkers';

export default class Validators {
  static loginFields(body: types.user.UserCreateToken): void {
    type KeyBody = keyof types.user.UserCreateToken;

    ['password', 'email'].forEach((field) => {
      if (!checkers.checkKeys<types.user.UserCreateToken>(body, field)) {
        throw new Error('All fields must be filled');
      }

      if (checkers.isEmpty(body[field as KeyBody])) {
        throw new Error('All fields must be filled');
      }
    });
  }
}
