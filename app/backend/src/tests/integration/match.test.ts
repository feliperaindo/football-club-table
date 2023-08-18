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
  const PATH_ROOT = '/matches';

  afterEach(sinon.restore);

  describe('Sequência de testes sobre a rota GET', function () {
    describe('Sequência para casos de sucesso', function () {
      const OK: types.Status = 200;

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

      it('Se a rota raiz retorna os matches finalizados se a query "inProgress" for falsa', async function () {
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

    // describe('Sequência para casos de falha', function () {
    //   const NOT_FOUND: types.Status = 404;

    //   it('Verifica se o status e mensagem caso não encontre o time pelo id', async function () {
    //     const fakeModel = sinon.stub(models.TeamModel, 'findByPk').resolves(null);

    //     const team = await chai.request(app).get(PATH_ID);

    //     sinon.assert.calledOnce(fakeModel);
    //     expect(team).to.have.status(NOT_FOUND);
    //     expect(team.body).to.be.deep.equal({ message: 'Team not found' });
    //   });
    // });
  });
});
