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

describe('Sequência de testes sobre a rota "/matches"', function () {
  // Paths
  const PATH_ID = '/matches/3';
  const PATH_ROOT = '/matches';
  const PATH_LOGIN = '/login';
  const PATH_FINISH = '/matches/3/finish';

  // HTTP status
  const OK: types.Status = 200;
  const CREATED: types.Status = 201;

  // Header
  const AUTHORIZATION = 'authorization';
  let TOKEN = '';

  before(async function () {
    const { body } = await chai.request(app).post(PATH_LOGIN).send(mocks.users.admin);
    TOKEN = `Bearer ${body.token}`;
  });

  afterEach(sinon.restore);

  describe('Sequência para casos de sucesso', function () {
    describe('Sequência de testes sobre a rota root com método GET', function () {
      it('Se a rota raiz retorna todos os matches corretamente', async function () {
        const buildModel = models.MatchModel.bulkBuild(
          mocks.matches,
          {
            include:
              [
                { model: models.TeamModel, as: 'homeTeam', attributes: { exclude: ['id'] } },
                { model: models.TeamModel, as: 'awayTeam', attributes: { exclude: ['id'] } },
              ],
          },
        );
        const fakeModel = sinon.stub(models.MatchModel, 'findAll').resolves(buildModel);

        const allMatches = await chai.request(app).get(PATH_ROOT);

        sinon.assert.calledOnce(fakeModel);
        expect(allMatches).to.have.status(OK);
        expect(allMatches.body).to.be.deep.equal(mocks.matches);
      });

      it('Se a rota raiz retorna os matches em progresso se a query "inProgress" for true', async function () {
        const buildModel = models.MatchModel.bulkBuild(mocks.matchesInProgress, {
          include:
            [
              { model: models.TeamModel, as: 'homeTeam', attributes: { exclude: ['id'] } },
              { model: models.TeamModel, as: 'awayTeam', attributes: { exclude: ['id'] } },
            ],
        });
        const fakeModel = sinon.stub(models.MatchModel, 'findAll').resolves(buildModel);

        const response = await chai.request(app).get(PATH_ROOT).query({ inProgress: true });

        sinon.assert.calledOnce(fakeModel);
        expect(response).to.have.status(OK);
        expect(response.body).to.be.deep.equal(mocks.matchesInProgress);
      });

      it('Se a rota raiz retorna os matches finalizados se a query "inProgress" for false', async function () {
        const buildModel = models.MatchModel.bulkBuild(mocks.matchesEnded, {
          include:
            [
              { model: models.TeamModel, as: 'homeTeam', attributes: { exclude: ['id'] } },
              { model: models.TeamModel, as: 'awayTeam', attributes: { exclude: ['id'] } },
            ],
        });
        const fakeModel = sinon.stub(models.MatchModel, 'findAll').resolves(buildModel);

        const response = await chai.request(app).get(PATH_ROOT).query({ inProgress: true });

        sinon.assert.calledOnce(fakeModel);
        expect(response).to.have.status(OK);
        expect(response.body).to.be.deep.equal(mocks.matchesEnded);
      });
    });

    describe('Sequência de testes sobre as rotas "/:id/finish" e "/:id" com método PATCH', function () {
      it('Se retorna o status "OK" e uma mensagem de sucesso de finalização', async function () {
        const buildModel = models.MatchModel.build(mocks.matchesRaw[1]);
        const fakeModel = sinon.stub(models.MatchModel, 'update').resolves();
        const fakeChecker = sinon.stub(models.MatchModel, 'findByPk').resolves(buildModel);

        const result = await chai.request(app).patch(PATH_FINISH).set(AUTHORIZATION, TOKEN);

        sinon.assert.calledOnce(fakeModel);
        sinon.assert.calledOnce(fakeChecker);
        expect(result).to.have.status(OK);
        expect(result.body).to.be.deep.equal({ message: 'Finalizado' });
      });

      it('Se retorna o status "OK" e uma mensagem de sucesso de atualização', async function () {
        const buildModel = models.MatchModel.build(mocks.matchesRaw[1]);
        const fakeModel = sinon.stub(models.MatchModel, 'update').resolves();
        const fakeChecker = sinon.stub(models.MatchModel, 'findByPk').resolves(buildModel);

        const result = await chai.request(app)
          .patch(PATH_ID)
          .set(AUTHORIZATION, TOKEN)
          .send(mocks.newMatches.validMatch);

        sinon.assert.calledOnce(fakeModel);
        sinon.assert.calledOnce(fakeChecker);
        expect(result).to.have.status(OK);
        expect(result.body).to.be.deep.equal({ message: 'Score updated' });
      });
    });

    describe('Sequência de testes sobre a rota root com método POST', function () {
      it('Se retorna o status "CREATED" e as informações do novo match', async function () {
        const buildTeamModel = models.TeamModel.bulkBuild(mocks.teams);
        const buildMatchModel = models.MatchModel.build(mocks.newMatches.registerModelMatch);
        const fakeModel = sinon.stub(models.MatchModel, 'create').resolves(buildMatchModel);
        const fakeChecker = sinon.stub(models.TeamModel, 'findByPk')
          .onFirstCall()
          .resolves(buildTeamModel[1])
          .onSecondCall()
          .resolves(buildTeamModel[9]);

        const newMatch = await chai.request(app)
          .post(PATH_ROOT)
          .set(AUTHORIZATION, TOKEN)
          .send(mocks.newMatches.validMatch);

        sinon.assert.calledOnce(fakeModel);
        sinon.assert.calledTwice(fakeChecker);
        expect(newMatch).to.have.status(CREATED);
        expect(newMatch.body).to.be.deep.equal(mocks.newMatches.registerModelMatch);
      });
    });
  });
});
