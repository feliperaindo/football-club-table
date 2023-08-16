// libraries
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as jwt from 'jsonwebtoken';
import { describe, it } from 'mocha';
import * as sinonChai from 'sinon-chai';

// types
import { Request, Response, NextFunction } from 'express';
import * as types from '../../../types/exporter';

// utils
import { validators, JWT } from '../../../utils/exporter';

// Middleware
import { TokenMid } from '../../../middleware/exporter';

// config
chai.use(sinonChai);
const { expect } = chai;

describe('Sequência de testes sobre os middleware da rota "/login"', function () {
  const UNAUTHORIZED: types.Status = 401;
  const CUSTOM_ERROR_MESSAGE = 'Custom error message';
  const TOKEN_ERROR_MESSAGE = 'Token must be a valid token';

  // Express
  const req = {} as Request;
  const res = {} as Response;
  let next: NextFunction;

  beforeEach(function () { next = sinon.stub().returns(null) as NextFunction; });

  afterEach(sinon.restore);

  describe('Sequência de testes sobre as funções de validação de token', function () {
    beforeEach(function () { req.headers = { authorization: 'Bearer valid token' }; });

    it('O método validador do campo authorization deve chamar a função next em caso de erro', function () {
      const fakeValidator = sinon.stub(validators, 'authorizationField')
        .throws(function () { throw new Error(CUSTOM_ERROR_MESSAGE); });

      TokenMid.authorizationValidation(req, res, next);

      sinon.assert.calledOnce(fakeValidator);
      expect(next).to.have.been.calledOnceWith({ message: CUSTOM_ERROR_MESSAGE, http: UNAUTHORIZED });
    });

    it('O método validador do token deve chamara função next em caso de erro', function () {
      const fakeValidator = sinon.stub(JWT, 'validateToken')
        .throws(function () { throw new Error(); });

      TokenMid.authorizationValidation(req, res, next);

      sinon.assert.calledOnce(fakeValidator);
      expect(next).to.have.been.calledWith({ message: TOKEN_ERROR_MESSAGE, http: UNAUTHORIZED });
    });

    it('A classe deve chamar a função next sem parâmetro em caso de sucesso das validações', function () {
      const fakeJWT = sinon.stub(jwt, 'verify').callsFake(function () { return null; });

      TokenMid.authorizationValidation(req, res, next);

      sinon.assert.calledOnce(fakeJWT);
      expect(next).to.have.been.calledWith();
    });
  });
});
