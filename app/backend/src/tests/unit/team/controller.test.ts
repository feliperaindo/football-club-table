// Bibliotecas
import * as chai from 'chai';
import * as sinon from 'sinon';
import { describe, it } from 'mocha';
import * as sinonChai from 'sinon-chai';

// types
import { NextFunction, Request, Response } from 'express';
import * as types from '../../../types/exporter';

// Mocks
import { teams } from '../../mocks/exporter';

// Service
import { TeamService } from '../../../service/exporter';

// Controller a ser testado
import { TeamController } from '../../../controller/exporter';

// configurations
chai.use(sinonChai);
const { expect } = chai;

describe('Sequência de testes sobre a camada controller da rota "/teams"', function () {
  // Status
  const OK_STATUS: types.Status = 200;
  const NOT_FOUND_STATUS: types.Status = 404;

  // Express
  const req = {} as Request;
  const res = {} as Response;
  let next: NextFunction;

  // Controller
  const controller = new TeamController();

  describe('Sequência de testes para casos de sucesso da requisição', function () {
    beforeEach(function () {
      res.status = sinon.stub().returns(res);
      res.send = sinon.stub().returns(res);
    });

    afterEach(sinon.restore);

    it('Verifica se a resposta retorna status OK e todos os times cadastrados', async function () {
      const fakeService = sinon.stub(TeamService.prototype, 'getAll').resolves(teams);

      await controller.allTeams(req, res);

      sinon.assert.calledOnce(fakeService);
      expect(res.send).to.have.been.calledWith(teams);
      expect(res.status).to.have.been.calledWith(OK_STATUS);
    });

    it('Verifica se a resposta retorna status OK e o respectivo time de id número 4', async function () {
      const fakeService = sinon.stub(TeamService.prototype, 'getById').resolves(teams[3]);
      req.params = { id: '4' };

      await controller.teamById(req, res, next);

      sinon.assert.calledOnce(fakeService);
      expect(res.send).to.have.been.calledWith(teams[3]);
      expect(res.status).to.have.been.calledWith(OK_STATUS);
    });
  });

  describe('Sequência de testes para casos de falha da requisição', function () {
    const ERROR_MESSAGE = 'minha mensagem de error customizada';
    const errorType: types.errors.ErrorHandler = { message: ERROR_MESSAGE, http: NOT_FOUND_STATUS };

    it('Verifica se a função next é chamada com a estrutura de error correta', async function () {
      req.params = { id: '1000' };
      res.status = sinon.stub().returns(res);
      res.send = sinon.stub().returns(res);
      next = sinon.stub().returns(null) as NextFunction;

      const fakeService = sinon
        .stub(TeamService.prototype, 'getById')
        .throws(function () { throw new Error(ERROR_MESSAGE); });

      await controller.teamById(req, res, next);

      sinon.assert.calledOnce(fakeService);
      expect(next).to.have.been.calledWith(errorType);

      sinon.restore();
    });
  });
});
