// libraries
import * as chai from 'chai';
import { describe, it } from 'mocha';

// types
import { user, match } from '../../../types/exporter';

// mocks
import { login, newMatches } from '../../mocks/exporter';

// utils
import { validators } from '../../../utils/exporter';

// config
const { expect } = chai;

describe('Sequência de testes sobre a os validadores', function () {
  const FIELD_ERROR = 'All fields must be filled';
  const SAME_TEAM_ERROR = 'It is not possible to create a match with two equal teams';
  const TOKEN_NOT_FOUND = 'Token not found';
  const INVALID_ID_ERROR = 'Only numbers accepted for id';
  const INVALID_GOALS_ERROR = 'Invalid goals number';
  const EMAIL_PASSWORD_ERROR = 'Invalid email or password';

  it('Se um erro é lançado caso não existam os dados de login', function () {
    expect(() => validators.loginFields(login.emptyEmail)).to.Throw(FIELD_ERROR);
    expect(() => validators.loginFields(login.emptyPassword)).to.Throw(FIELD_ERROR);
    expect(() => validators.loginFields(login.inexistentEmail as user.UserCreateToken))
      .to.Throw(FIELD_ERROR);
    expect(() => validators.loginFields(login.inexistentPassword as user.UserCreateToken))
      .to.Throw(FIELD_ERROR);
    expect(() => validators.loginFields(login.validUser))
      .not.to.Throw(FIELD_ERROR);
  });

  it('Se um erro é lançado caso não existam os ids do novo match', function () {
    expect(() => validators.newMatchFields(newMatches.noHomeIdMatch as match.MatchPost))
      .to.Throw(FIELD_ERROR);
    expect(() => validators.newMatchFields(newMatches.noAwayIdMatch as match.MatchPost))
      .to.Throw(FIELD_ERROR);
    expect(() => validators.newMatchFields(newMatches.validMatch))
      .not.to.Throw(FIELD_ERROR);
  });

  it('Se um erro é lançado caso os ids do novo match sejam inválidos', function () {
    expect(() => validators.newMatchFields(newMatches.invalidAwayId as unknown as match.MatchPost))
      .to.Throw(INVALID_ID_ERROR);
    expect(() => validators.newMatchFields(newMatches.invalidHomeId as unknown as match.MatchPost))
      .to.Throw(INVALID_ID_ERROR);
    expect(() => validators.newMatchFields(newMatches.validMatch))
      .not.to.Throw(INVALID_ID_ERROR);
  });

  it('Se um erro é lançado caso não exista os goals do match', function () {
    expect(() => validators.matchGoalFields(newMatches.noAwayGoalMatch as match.MatchPost))
      .to.Throw(FIELD_ERROR);
    expect(() => validators.matchGoalFields(newMatches.noHomeGoalMatch as match.MatchPost))
      .to.Throw(FIELD_ERROR);
    expect(() => validators.matchGoalFields(newMatches.validMatch))
      .not.to.Throw(FIELD_ERROR);
  });

  it('Se um erro é lançado caso os goals tenha valor não numérico', function () {
    expect(() => validators.matchGoalFields(newMatches.invalidGoalsAway as unknown as match.MatchPost))
      .to.Throw(INVALID_GOALS_ERROR);
    expect(() => validators.matchGoalFields(newMatches.invalidGoalsHome as unknown as match.MatchPost))
      .to.Throw(INVALID_GOALS_ERROR);
    expect(() => validators.matchGoalFields(newMatches.validMatch))
      .not.to.Throw(INVALID_GOALS_ERROR);
  });

  it('Se um erro é lançado caso o email tenha um formato inválido', function () {
    expect(() => validators.validateEmail(login.unformattedEmail.email))
      .to.Throw(EMAIL_PASSWORD_ERROR);
    expect(() => validators.validateEmail(login.validUser.email))
      .not.to.Throw(EMAIL_PASSWORD_ERROR);
  });

  it('Se um erro é lançado caso a senha seja menor que 6 caracteres', function () {
    expect(() => validators.validatePassword(login.shortPassword.password))
      .to.Throw(EMAIL_PASSWORD_ERROR);
    expect(() => validators.validatePassword(login.validUser.password))
      .not.to.Throw(EMAIL_PASSWORD_ERROR);
  });

  it('Se um erro é lançado caso não exista o campo authorization', function () {
    expect(() => validators.authorizationField({} as user.Authorization))
      .to.Throw(TOKEN_NOT_FOUND);
    expect(() => validators.authorizationField({ authorization: 'token' }))
      .not.to.Throw(TOKEN_NOT_FOUND);
  });

  it('Se um erro é lançado caso o id sejam um valor não numérico', function () {
    expect(() => validators.validateId('string')).to.Throw(INVALID_ID_ERROR);
    expect(() => validators.validateId('123')).not.to.Throw(INVALID_ID_ERROR);
  });

  it('Se um erro é lançado caso os ids dos oponentes sejam iguais', function () {
    expect(() => validators.validateSameTeam(1, 1)).to.Throw(SAME_TEAM_ERROR);
    expect(() => validators.validateSameTeam(1, 2)).not.to.Throw(SAME_TEAM_ERROR);
  });
});
