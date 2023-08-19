// Bibliotecas
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as jwt from 'jsonwebtoken';
import { describe, it } from 'mocha';
import * as sinonChai from 'sinon-chai';

// types
import { NextFunction, Request, Response } from 'express';
import * as types from '../../../types/exporter';

// Mocks
import { login, token } from '../../mocks/exporter';

// Service
import { UserService } from '../../../service/exporter';

// Controller a ser testado
import { UserController } from '../../../controller/exporter';

// configurations
chai.use(sinonChai);
const { expect } = chai;

describe('Sequência de testes sobre a camada controller da rota "/login"', function () {
  // Status
  const OK_STATUS: types.Status = 200;
  const UNAUTHORIZED: types.Status = 401;

  // Express
  const req = {} as Request;
  const res = {} as Response;
  let next: NextFunction;

  // Controller
  const controller = new UserController();

  beforeEach(function () {
    req.body = login.validUser;
    req.headers = { authorization: 'Bearer valid token' };
    res.status = sinon.stub().returns(res);
    res.send = sinon.stub().returns(res);
    next = sinon.stub().returns(null) as NextFunction;
  });

  afterEach(sinon.restore);

  describe('Sequência de testes para casos de sucesso da requisição', function () {
    it('Verifica se a resposta retorna status OK e um token', async function () {
      const fakeService = sinon.stub(UserService.prototype, 'getToken')
        .resolves({ token: token.validToken });

      await controller.login(req, res, next);

      sinon.assert.calledOnce(fakeService);
      expect(res.send).to.have.been.calledWith({ token: token.validToken });
      expect(res.status).to.have.been.calledWith(OK_STATUS);
      expect(fakeService).to.have.been.calledWith(login.validUser);
    });

    it('Verifica se a resposta retorna a função do usuário', async function () {
      const fakeJWT = sinon.stub(jwt, 'decode').returns(login.validUser);
      const fakeService = sinon.stub(UserService.prototype, 'getRole').resolves({ role: 'admin' });

      await controller.requireUserRole(req, res);

      sinon.assert.calledOnce(fakeJWT);
      sinon.assert.calledOnce(fakeService);
      expect(res.status).to.have.been.calledWith(OK_STATUS);
      expect(res.send).to.have.been.calledWith({ role: 'admin' });
    });
  });

  describe('Sequência de testes para casos de falha da requisição', function () {
    const ERROR_MESSAGE = 'minha mensagem de error customizada';
    const errorType: types.errors.ErrorHandler = { message: ERROR_MESSAGE, http: UNAUTHORIZED };

    it('Verifica se a função next é chamada com a estrutura de error correta', async function () {
      const fakeService = sinon
        .stub(UserService.prototype, 'getToken')
        .throws(function () { throw new Error(ERROR_MESSAGE); });

      await controller.login(req, res, next);

      sinon.assert.calledOnce(fakeService);
      expect(next).to.have.been.calledWith(errorType);
    });
  });
});
