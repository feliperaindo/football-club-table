// libraries
import * as chai from 'chai';
import { describe, it } from 'mocha';

// types
import { user } from '../../../types/exporter';

// mocks
import { login } from '../../mocks/exporter';

// utils
import { validators } from '../../../utils/exporter';

// config
const { expect } = chai;

describe('Sequência de testes sobre a os validadores', function () {
  const FIELD_ERROR = 'All fields must be filled';
  const TOKEN_NOT_FOUND = 'Token not found';
  const EMAIL_PASSWORD_ERROR = 'Invalid email or password';

  it('Verifica se um erro é lançado caso não sejam fornecidos os dados de login', function () {
    expect(() => validators.loginFields(login.emptyEmail)).to.Throw(FIELD_ERROR);
    expect(() => validators.loginFields(login.emptyPassword)).to.Throw(FIELD_ERROR);
    expect(() => validators.loginFields(login.inexistentEmail as user.UserCreateToken))
      .to.Throw(FIELD_ERROR);
    expect(() => validators.loginFields(login.inexistentPassword as user.UserCreateToken))
      .to.Throw(FIELD_ERROR);
  });

  it('Verifica se é um erro é lançado caso o email tenha um formato inválido', function () {
    expect(() => validators.validateEmail(login.unformattedEmail.email))
      .to.Throw(EMAIL_PASSWORD_ERROR);
  });

  it('Verifica se é um erro é lançado caso a senha seja menor que 6 caracteres', function () {
    expect(() => validators.validatePassword(login.shortPassword.password))
      .to.Throw(EMAIL_PASSWORD_ERROR);
  });

  it('Verifica se um erro é lançado caso naõ seja fornecido campo authorization', function () {
    expect(() => validators.authorizationField({} as user.Authorization))
      .to.Throw(TOKEN_NOT_FOUND);
  });
});
