// libraries
import * as chai from 'chai';
import * as sinon from 'sinon';
// @ts-ignore
import chaiHttp = require('chai-http');

// Mocks
import * as mocks from '../mocks/exporter';

// types
import * as types from '../../types/exporter';

// app
import { app } from '../../app';

// Model
import * as models from '../../database/models/exporter';

// configurations
chai.use(chaiHttp);
const { expect } = chai;

describe('Primeira sequência de testes para casos falhos sobre a rota "/matches"', function () {
  // Paths
  const PATH_ID = '/matches/3';
  const PATH_LOGIN = '/login';
  const PATH_FINISH = '/matches/3/finish';
  const PATH_ID_INVALID = '/matches/invalid';
  const PATH_FINISH_INVALID = '/matches/invalid/finish';

  // HTTP status
  const NOT_FOUND: types.Status = 404;
  const BAD_REQUEST: types.Status = 400;
  const UNAUTHORIZED: types.Status = 401;

  // Messages
  const INVALID_ID = 'Only numbers accepted for id';
  const FIELD_ERROR = 'All fields must be filled';
  const MATCH_ENDED = 'Match already ended';
  const GOAL_INVALID = 'Invalid goals number';
  const TOKEN_INVALID = 'Token must be a valid token';
  const TOKEN_NOT_FOUND = 'Token not found';
  const MATCH_NOT_FOUND = 'Match not found';

  // Header
  const AUTHORIZATION = 'authorization';
  let TOKEN = '';

  before(async function () {
    const { body } = await chai.request(app).post(PATH_LOGIN).send(mocks.users.admin);
    TOKEN = `Bearer ${body.token}`;
  });

  afterEach(sinon.restore);

  describe('Sequência sobre a rota "/:id/finish"', function () {
    it('Se o status e mensagem corretos retornam caso não encontre o token', async function () {
      const error = await chai.request(app).patch(PATH_FINISH);

      expect(error).to.have.status(UNAUTHORIZED);
      expect(error.body).to.be.deep.equal({ message: TOKEN_NOT_FOUND });
    });

    it('Se o status e mensagem corretos retornam caso token seja inválido', async function () {
      const error = await chai.request(app)
        .patch(PATH_FINISH)
        .set(AUTHORIZATION, `Bearer ${mocks.token.invalidToken}`);

      expect(error).to.have.status(UNAUTHORIZED);
      expect(error.body).to.be.deep.equal({ message: TOKEN_INVALID });
    });

    it('Se o status e mensagem corretos retornam caso o parâmetro seja inválido', async function () {
      const error = await chai.request(app)
        .patch(PATH_FINISH_INVALID)
        .set(AUTHORIZATION, TOKEN);

      expect(error).to.have.status(BAD_REQUEST);
      expect(error.body).to.be.deep.equal({ message: INVALID_ID });
    });

    it('Se o status e mensagem corretos retornam caso o match não exista', async function () {
      const fakeModel = sinon.stub(models.MatchModel, 'findByPk').resolves(null);

      const error = await chai.request(app)
        .patch(PATH_FINISH)
        .set(AUTHORIZATION, TOKEN);

      sinon.assert.calledOnce(fakeModel);
      expect(error).to.have.status(NOT_FOUND);
      expect(error.body).to.be.deep.equal({ message: MATCH_NOT_FOUND });
    });

    it('Se o status e mensagem corretos retornam caso o match esteja encerrado', async function () {
      const buildModel = models.MatchModel.build(mocks.matchesRaw[0]);
      const fakeModel = sinon.stub(models.MatchModel, 'findByPk').resolves(buildModel);

      const error = await chai.request(app)
        .patch(PATH_FINISH)
        .set(AUTHORIZATION, TOKEN);

      sinon.assert.calledOnce(fakeModel);
      expect(error).to.have.status(NOT_FOUND);
      expect(error.body).to.be.deep.equal({ message: MATCH_ENDED });
    });
  });

  describe('Sequência sobre a rota "/:id"', function () {
    it('Se o status e mensagem corretos retornam caso não encontre o token', async function () {
      const error = await chai.request(app).patch(PATH_ID);

      expect(error).to.have.status(UNAUTHORIZED);
      expect(error.body).to.be.deep.equal({ message: TOKEN_NOT_FOUND });
    });

    it('Se o status e mensagem corretos retornam caso token seja inválido', async function () {
      const error = await chai.request(app)
        .patch(PATH_ID)
        .set(AUTHORIZATION, `Bearer ${mocks.token.invalidToken}`);

      expect(error).to.have.status(UNAUTHORIZED);
      expect(error.body).to.be.deep.equal({ message: TOKEN_INVALID });
    });

    it('Se o status e mensagem corretos retornam caso o parâmetro seja inválido', async function () {
      const error = await chai.request(app)
        .patch(PATH_ID_INVALID)
        .set(AUTHORIZATION, TOKEN);

      expect(error).to.have.status(BAD_REQUEST);
      expect(error.body).to.be.deep.equal({ message: INVALID_ID });
    });

    it('Se o status e mensagem corretos retornam caso falte os campos de gols', async function () {
      const noAwayGoals = await chai.request(app)
        .patch(PATH_ID)
        .set(AUTHORIZATION, TOKEN)
        .send(mocks.newMatches.noAwayGoalMatch);

      const noHomeGoals = await chai.request(app)
        .patch(PATH_ID)
        .set(AUTHORIZATION, TOKEN)
        .send(mocks.newMatches.noHomeGoalMatch);

      expect(noAwayGoals).to.have.status(BAD_REQUEST);
      expect(noHomeGoals).to.have.status(BAD_REQUEST);
      expect(noAwayGoals.body).to.be.deep.equal({ message: FIELD_ERROR });
      expect(noHomeGoals.body).to.be.deep.equal({ message: FIELD_ERROR });
    });

    it('Se o status e mensagem corretos retornam caso os campos de gols sejam inválidos', async function () {
      const noAwayGoals = await chai.request(app)
        .patch(PATH_ID)
        .set(AUTHORIZATION, TOKEN)
        .send(mocks.newMatches.invalidGoalsAway);

      const noHomeGoals = await chai.request(app)
        .patch(PATH_ID)
        .set(AUTHORIZATION, TOKEN)
        .send(mocks.newMatches.invalidGoalsHome);

      expect(noAwayGoals).to.have.status(BAD_REQUEST);
      expect(noHomeGoals).to.have.status(BAD_REQUEST);
      expect(noAwayGoals.body).to.be.deep.equal({ message: GOAL_INVALID });
      expect(noHomeGoals.body).to.be.deep.equal({ message: GOAL_INVALID });
    });

    it('Se o status e mensagem corretos retornam caso o match não exista', async function () {
      const fakeModel = sinon.stub(models.MatchModel, 'findByPk').resolves(null);

      const error = await chai.request(app)
        .patch(PATH_ID)
        .set(AUTHORIZATION, TOKEN)
        .send(mocks.newMatches.validMatch);

      sinon.assert.calledOnce(fakeModel);
      expect(error).to.have.status(NOT_FOUND);
      expect(error.body).to.be.deep.equal({ message: MATCH_NOT_FOUND });
    });

    it('Se o status e mensagem corretos retornam caso o match esteja encerrado', async function () {
      const buildModel = models.MatchModel.build(mocks.matchesRaw[0]);
      const fakeModel = sinon.stub(models.MatchModel, 'findByPk').resolves(buildModel);

      const error = await chai.request(app)
        .patch(PATH_ID)
        .set(AUTHORIZATION, TOKEN)
        .send(mocks.newMatches.validMatch);

      sinon.assert.calledOnce(fakeModel);
      expect(error).to.have.status(NOT_FOUND);
      expect(error.body).to.be.deep.equal({ message: MATCH_ENDED });
    });
  });
});
