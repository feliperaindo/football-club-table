// libraries
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as jwt from 'jsonwebtoken';
import { describe, it } from 'mocha';
import * as sinonChai from 'sinon-chai';

// types
import { Request, Response, NextFunction } from 'express';
import * as types from '../../../types/exporter';

// mocks
import { login } from '../../mocks/exporter';

// utils
import { validators, JWT } from '../../../utils/exporter';

// Middleware
import { LoginMid } from '../../../middleware/exporter';

// config
chai.use(sinonChai);
const { expect } = chai;

describe('Sequência de testes sobre os middleware da rota "/login"', function () {
  const BAD_REQUEST: types.Status = 400;
  const UNAUTHORIZED: types.Status = 401;
  const CUSTOM_ERROR_MESSAGE = 'Custom error message';
  const TOKEN_ERROR_MESSAGE = 'Token must be a valid token';

  // Express
  const req = {} as Request;
  const res = {} as Response;
  let next: NextFunction;

  beforeEach(function () { next = sinon.stub().returns(null) as NextFunction; });

  afterEach(sinon.restore);

  describe('Sequência de testes sobre as funções de validação de login', function () {
    beforeEach(function () { req.body = login.validUser; });

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

    describe('Sequência de testes sobre as funções de validação de token', function () {
      beforeEach(function () { req.headers = { authorization: 'Bearer valid token' }; });

      it('O método validador do campo authorization deve chamar a função next em caso de erro', function () {
        const fakeValidator = sinon.stub(validators, 'authorizationField')
          .throws(function () { throw new Error(CUSTOM_ERROR_MESSAGE); });

        LoginMid.authorizationValidation(req, res, next);

        sinon.assert.calledOnce(fakeValidator);
        expect(next).to.have.been.calledOnceWith({ message: CUSTOM_ERROR_MESSAGE, http: UNAUTHORIZED });
      });

      it('O método validador do token deve chamara função next em caso de erro', function () {
        const fakeValidator = sinon.stub(JWT, 'validateToken')
          .throws(function () { throw new Error(); });

        LoginMid.authorizationValidation(req, res, next);

        sinon.assert.calledOnce(fakeValidator);
        expect(next).to.have.been.calledWith({ message: TOKEN_ERROR_MESSAGE, http: UNAUTHORIZED });
      });

      it('A classe deve chamar a função next sem parâmetro em caso de sucesso das validações', function () {
        const fakeJWT = sinon.stub(jwt, 'verify').callsFake(function () { return null; });

        LoginMid.authorizationValidation(req, res, next);

        sinon.assert.calledOnce(fakeJWT);
        expect(next).to.have.been.calledWith();
      });
    });
  });
});
