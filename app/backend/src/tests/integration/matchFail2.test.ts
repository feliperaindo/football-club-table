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

describe('Segunda sequência de testes para casos falhos sobre a rota "/matches"', function () {
  // Paths
  const PATH_ROOT = '/matches';
  const PATH_LOGIN = '/login';

  // HTTP status
  const NOT_FOUND: types.Status = 404;
  const BAD_REQUEST: types.Status = 400;
  const UNAUTHORIZED: types.Status = 401;
  const UNPROCESSABLE_ENTITY: types.Status = 422;

  // Messages
  const INVALID_ID = 'Only numbers accepted for id';
  const FIELD_ERROR = 'All fields must be filled';
  const GOAL_INVALID = 'Invalid goals number';
  const TOKEN_INVALID = 'Token must be a valid token';
  const TEAM_NOT_FOUND = 'There is no team with such id!';
  const TOKEN_NOT_FOUND = 'Token not found';
  const SAME_TEAM_ERROR = 'It is not possible to create a match with two equal teams';

  // Header
  const AUTHORIZATION = 'authorization';
  let TOKEN = '';

  before(async function () {
    const { body } = await chai.request(app).post(PATH_LOGIN).send(mocks.users.admin);
    TOKEN = `Bearer ${body.token}`;
  });

  afterEach(sinon.restore);

  describe('Sequência sobre a rota raiz com método POST', function () {
    it('Se o status e mensagem corretos retornam caso não encontre o token', async function () {
      const error = await chai.request(app).post(PATH_ROOT);

      expect(error).to.have.status(UNAUTHORIZED);
      expect(error.body).to.be.deep.equal({ message: TOKEN_NOT_FOUND });
    });

    it('Se o status e mensagem corretos retornam caso token seja inválido', async function () {
      const error = await chai.request(app)
        .post(PATH_ROOT)
        .set(AUTHORIZATION, `Bearer ${mocks.token.invalidToken}`);

      expect(error).to.have.status(UNAUTHORIZED);
      expect(error.body).to.be.deep.equal({ message: TOKEN_INVALID });
    });

    it('Se o status e mensagem corretos retornam caso falte os campos de id dos times', async function () {
      const noAwayId = await chai.request(app)
        .post(PATH_ROOT)
        .set(AUTHORIZATION, TOKEN)
        .send(mocks.newMatches.noAwayIdMatch);

      const noHomeId = await chai.request(app)
        .post(PATH_ROOT)
        .set(AUTHORIZATION, TOKEN)
        .send(mocks.newMatches.noHomeIdMatch);

      expect(noAwayId).to.have.status(BAD_REQUEST);
      expect(noHomeId).to.have.status(BAD_REQUEST);
      expect(noAwayId.body).to.be.deep.equal({ message: FIELD_ERROR });
      expect(noHomeId.body).to.be.deep.equal({ message: FIELD_ERROR });
    });

    it('Se o status e mensagem corretos retornam caso os campos de id sejam inválidos', async function () {
      const invalidAwayId = await chai.request(app)
        .post(PATH_ROOT)
        .set(AUTHORIZATION, TOKEN)
        .send(mocks.newMatches.invalidAwayId);

      const invalidHomeId = await chai.request(app)
        .post(PATH_ROOT)
        .set(AUTHORIZATION, TOKEN)
        .send(mocks.newMatches.invalidHomeId);

      expect(invalidAwayId).to.have.status(BAD_REQUEST);
      expect(invalidHomeId).to.have.status(BAD_REQUEST);
      expect(invalidAwayId.body).to.be.deep.equal({ message: INVALID_ID });
      expect(invalidHomeId.body).to.be.deep.equal({ message: INVALID_ID });
    });

    it('Se o status e mensagem corretos retornam caso falte os campos de gols', async function () {
      const noAwayGoals = await chai.request(app)
        .post(PATH_ROOT)
        .set(AUTHORIZATION, TOKEN)
        .send(mocks.newMatches.noAwayGoalMatch);

      const noHomeGoals = await chai.request(app)
        .post(PATH_ROOT)
        .set(AUTHORIZATION, TOKEN)
        .send(mocks.newMatches.noHomeGoalMatch);

      expect(noAwayGoals).to.have.status(BAD_REQUEST);
      expect(noHomeGoals).to.have.status(BAD_REQUEST);
      expect(noAwayGoals.body).to.be.deep.equal({ message: FIELD_ERROR });
      expect(noHomeGoals.body).to.be.deep.equal({ message: FIELD_ERROR });
    });

    it('Se o status e mensagem corretos retornam caso os campos de gols sejam inválidos', async function () {
      const invalidAwayGoals = await chai.request(app)
        .post(PATH_ROOT)
        .set(AUTHORIZATION, TOKEN)
        .send(mocks.newMatches.invalidGoalsAway);

      const invalidHomeGoals = await chai.request(app)
        .post(PATH_ROOT)
        .set(AUTHORIZATION, TOKEN)
        .send(mocks.newMatches.invalidGoalsHome);

      expect(invalidAwayGoals).to.have.status(BAD_REQUEST);
      expect(invalidHomeGoals).to.have.status(BAD_REQUEST);
      expect(invalidAwayGoals.body).to.be.deep.equal({ message: GOAL_INVALID });
      expect(invalidHomeGoals.body).to.be.deep.equal({ message: GOAL_INVALID });
    });

    it('Se o status e mensagens corretos retornam caso o time jogue contra si', async function () {
      const error = await chai.request(app)
        .post(PATH_ROOT)
        .set(AUTHORIZATION, TOKEN)
        .send(mocks.newMatches.sameTeamMatch);

      expect(error).to.have.status(UNPROCESSABLE_ENTITY);
      expect(error.body).to.be.deep.equal({ message: SAME_TEAM_ERROR });
    });

    it('Se o status e mensagem corretos retornam caso times de fora não exista', async function () {
      const fakeTeamModel = sinon.stub(models.TeamModel, 'findByPk').resolves(null);

      const error = await chai.request(app)
        .post(PATH_ROOT)
        .set(AUTHORIZATION, TOKEN)
        .send(mocks.newMatches.validMatch);

      sinon.assert.calledOnce(fakeTeamModel);
      expect(error).to.have.status(NOT_FOUND);
      expect(error.body).to.be.deep.equal({ message: TEAM_NOT_FOUND });
    });

    it('Se o status e mensagem corretos retornam caso times da casa não exista', async function () {
      const buildTeamModel = models.TeamModel.build(mocks.teams[1]);
      const fakeTeamModel = sinon.stub(models.TeamModel, 'findByPk')
        .onFirstCall()
        .resolves(buildTeamModel)
        .onSecondCall()
        .resolves(null);

      const error = await chai.request(app)
        .post(PATH_ROOT)
        .set(AUTHORIZATION, TOKEN)
        .send(mocks.newMatches.validMatch);

      sinon.assert.calledTwice(fakeTeamModel);
      expect(error).to.have.status(NOT_FOUND);
      expect(error.body).to.be.deep.equal({ message: TEAM_NOT_FOUND });
    });
  });
});
