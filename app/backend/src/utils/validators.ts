// types
import * as types from '../types/exporter';

// helpers
import checkers from '../helpers/checkers';

export default class Validators {
  private static readonly fieldError: string = 'All fields must be filled';
  private static readonly invalidIdError: string = 'Only numbers accepted for id';
  private static readonly tokenFieldError: string = 'Token not found';
  private static readonly invalidGoalField: string = 'Invalid goals number';
  private static readonly emailOrPasswordError: string = 'Invalid email or password';

  public static loginFields(body: types.user.UserCreateToken): void {
    type KeyBody = keyof types.user.UserCreateToken;

    ['password', 'email'].forEach((field) => {
      if (!checkers.checkKeys<types.user.UserCreateToken>(body, field)) {
        throw new Error(Validators.fieldError);
      }

      if (checkers.isEmpty(body[field as KeyBody])) { throw new Error(Validators.fieldError); }
    });
  }

  public static matchGoalFields(body: types.match.GoalsUpdate): void {
    type KeyBody = keyof types.match.GoalsUpdate;

    ['homeTeamGoals', 'awayTeamGoals'].forEach((field) => {
      if (!checkers.checkKeys<types.match.GoalsUpdate>(body, field)) {
        throw new Error(Validators.fieldError);
      }

      if (!checkers.checkOnlyNumbers(body[field as KeyBody].toString())) {
        throw new Error(Validators.invalidGoalField);
      }
    });
  }

  public static authorizationField(headers: types.user.Authorization): void {
    if (!checkers.checkKeys<types.user.Authorization>(headers, 'authorization')) {
      throw new Error(Validators.tokenFieldError);
    }
  }

  public static validateEmail(email: string): void {
    if (!checkers.checkEmail(email)) { throw new Error(Validators.emailOrPasswordError); }
  }

  public static validatePassword(password: string): void {
    if (!checkers.checkPassword(password)) { throw new Error(Validators.emailOrPasswordError); }
  }

  public static validateId(id: string): void {
    if (!checkers.checkOnlyNumbers(id)) { throw new Error(Validators.invalidIdError); }
  }
}
