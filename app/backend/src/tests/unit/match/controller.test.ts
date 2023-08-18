// libraries
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { describe, it } from 'mocha';

// types
import { NextFunction, Request, Response } from 'express';
import * as types from '../../../types/exporter';

// mocks
import { matches, matchesEnded, matchesInProgress, newMatches } from '../../mocks/exporter';

// service
import { MatchService, TeamService } from '../../../service/exporter';

// controller
import { MatchController } from '../../../controller/exporter';

// config
chai.use(sinonChai);
const { expect } = chai;

describe('Sequência de testes sobre controller da rota "/matches"', function () {
  // Status
  const OK_STATUS: types.Status = 200;
  const CREATED: types.Status = 201;
  const NOT_FOUND: types.Status = 404;

  // Messages
  const UPDATED = { message: 'Score updated' };
  const FINISHED = { message: 'Finalizado' };
  const CUSTOM_MESSAGE_ERROR = 'Custom error message';

  // Express
  const req = {} as Request;
  const res = {} as Response;
  let next: NextFunction;

  // controller
  const controller = new MatchController();

  beforeEach(function () {
    req.params = { id: '5' };
    req.body = newMatches.validMatch;
    res.send = sinon.stub().returns(res);
    res.status = sinon.stub().returns(res);
    next = sinon.stub().returns(null) as NextFunction;
  });

  afterEach(sinon.restore);

  describe('Sequência de testes para casos de sucesso', function () {
    it('Se response com status "OK" e informa todos os matches', async function () {
      const fakeService = sinon.stub(MatchService.prototype, 'getAll').resolves(matches);

      await controller.matchesByQuery(req, res);

      sinon.assert.calledOnce(fakeService);
      expect(res.status).to.have.been.calledWith(OK_STATUS);
      expect(res.send).to.have.been.calledOnceWith(matches);
    });

    it('Se response com status "OK" e devolve apenas o matches em andamento', async function () {
      req.query = { inProgress: 'true' };

      const fakeService = sinon.stub(MatchService.prototype, 'getByProgress')
        .resolves(matchesInProgress);

      await controller.matchesByQuery(req, res);

      sinon.assert.calledOnce(fakeService);
      expect(res.status).to.have.been.calledWith(OK_STATUS);
      expect(res.send).to.have.been.calledWith(matchesInProgress);
    });

    it('Se response com status "OK" e devolve apenas o matches finalizados', async function () {
      req.query = { inProgress: 'false' };

      const fakeService = sinon.stub(MatchService.prototype, 'getByProgress')
        .resolves(matchesEnded);

      await controller.matchesByQuery(req, res);

      sinon.assert.calledOnce(fakeService);
      expect(res.status).to.have.been.calledWith(OK_STATUS);
      expect(res.send).to.have.been.calledWith(matchesEnded);
    });

    it('Se responde com status "CREATED" e devolve os dados do novo match', async function () {
      const fakeTeamService = sinon.stub(TeamService.prototype, 'getById').resolves();
      const fakeService = sinon.stub(MatchService.prototype, 'createMatch')
        .resolves(newMatches.registerModelMatch);

      await controller.postMatch(req, res, next);

      sinon.assert.calledOnce(fakeService);
      sinon.assert.calledTwice(fakeTeamService);
      expect(res.status).to.have.been.calledWith(CREATED);
      expect(res.send).to.have.been.calledOnceWith(newMatches.registerModelMatch);
    });

    it('Se responde com status "OK" e devolve uma mensagem de sucesso na atualização', async function () {
      const fakeChecker = sinon.stub(MatchService.prototype, 'checkValidMatch').resolves();
      const fakeService = sinon.stub(MatchService.prototype, 'updateScore').resolves(UPDATED);

      await controller.updateScore(req, res, next);

      sinon.assert.calledOnce(fakeChecker);
      sinon.assert.calledOnce(fakeService);
      expect(res.send).to.have.been.calledWith(UPDATED);
      expect(res.status).to.have.been.calledWith(OK_STATUS);
    });

    it('Se responde com status "OK" e devolve uma mensagem de finalizado', async function () {
      const fakeChecker = sinon.stub(MatchService.prototype, 'checkValidMatch').resolves();
      const fakeService = sinon.stub(MatchService.prototype, 'finishMatch').resolves(FINISHED);

      await controller.endMatch(req, res, next);

      sinon.assert.calledOnce(fakeChecker);
      sinon.assert.calledOnce(fakeService);
      expect(res.send).to.have.been.calledWith(FINISHED);
      expect(res.status).to.have.been.calledWith(OK_STATUS);
    });
  });

  describe('Sequência de testes pra casos de falha', function () {
    it('Se registar uma partida com time não existente é chamada a função next', async function () {
      const fakeTeamService = sinon.stub(TeamService.prototype, 'getById')
        .throws(function () { throw new Error(CUSTOM_MESSAGE_ERROR); });

      await controller.postMatch(req, res, next);

      sinon.assert.calledOnce(fakeTeamService);
      expect(next).to.have.been.calledWith({ message: CUSTOM_MESSAGE_ERROR, http: NOT_FOUND });
    });

    it('Se atualizar o placar de uma partida inexistente é chamada a função next', async function () {
      const fakeChecker = sinon.stub(MatchService.prototype, 'checkValidMatch')
        .throws(function () { throw new Error(CUSTOM_MESSAGE_ERROR); });

      await controller.updateScore(req, res, next);

      sinon.assert.calledOnce(fakeChecker);
      expect(next).to.have.been.calledWith({ message: CUSTOM_MESSAGE_ERROR, http: NOT_FOUND });
    });

    it('Se encerrar uma partida inexistente é chamada a função next', async function () {
      const fakeChecker = sinon.stub(MatchService.prototype, 'checkValidMatch')
        .throws(function () { throw new Error(CUSTOM_MESSAGE_ERROR); });

      await controller.endMatch(req, res, next);

      sinon.assert.calledOnce(fakeChecker);
      expect(next).to.have.been.calledWith({ message: CUSTOM_MESSAGE_ERROR, http: NOT_FOUND });
    });
  });
});
