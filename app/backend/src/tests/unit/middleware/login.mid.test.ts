// libraries
import * as chai from 'chai';
import * as sinon from 'sinon';
import { describe, it } from 'mocha';
import * as sinonChai from 'sinon-chai';

// types
import { Request, Response, NextFunction } from 'express';
import * as types from '../../../types/exporter';

// mocks
import { login } from '../../mocks/exporter';

// utils
import { validators } from '../../../utils/exporter';

// Middleware
import { LoginMid } from '../../../middleware/exporter';

// config
chai.use(sinonChai);
const { expect } = chai;

describe('Sequência de testes sobre os middleware Login', function () {
  const BAD_REQUEST: types.Status = 400;
  const UNAUTHORIZED: types.Status = 401;
  const CUSTOM_ERROR_MESSAGE = 'Custom error message';

  // Express
  const req = {} as Request;
  const res = {} as Response;
  let next: NextFunction;

  beforeEach(function () {
    next = sinon.stub().returns(null) as NextFunction;
    req.body = login.validUser;
  });

  afterEach(sinon.restore);

  it('O método validador dos campos de logins deve chamar a função next em caso de erro', function () {
    const fakeValidator = sinon.stub(validators, 'loginFields')
      .throws(function () { throw new Error(CUSTOM_ERROR_MESSAGE); });

    LoginMid.LoginValidation(req, res, next);

    sinon.assert.calledOnce(fakeValidator);
    expect(next).to.have.been.calledWith({ message: CUSTOM_ERROR_MESSAGE, http: BAD_REQUEST });
  });

  it('O método validador de email deve chamar a função next em caso de erro', function () {
    const fakeValidator = sinon.stub(validators, 'validateEmail')
      .throws(function () { throw new Error(CUSTOM_ERROR_MESSAGE); });

    LoginMid.LoginValidation(req, res, next);

    sinon.assert.calledOnce(fakeValidator);
    expect(next).to.have.been.calledWith({ message: CUSTOM_ERROR_MESSAGE, http: UNAUTHORIZED });
  });

  it('O método validador de password deve chamar a função next em caso de erro', function () {
    const fakeValidator = sinon.stub(validators, 'validatePassword')
      .throws(function () { throw new Error(CUSTOM_ERROR_MESSAGE); });

    LoginMid.LoginValidation(req, res, next);

    sinon.assert.calledOnce(fakeValidator);
    expect(next).to.have.been.calledWith({ message: CUSTOM_ERROR_MESSAGE, http: UNAUTHORIZED });
  });

  it('A classe deve chamar a função next sem parâmetro em caso de sucesso da validações', function () {
    LoginMid.LoginValidation(req, res, next);

    expect(next).to.have.been.calledWith();
  });
});
