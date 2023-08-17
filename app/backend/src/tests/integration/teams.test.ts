// libraries
import * as chai from 'chai';
import * as sinon from 'sinon';
// @ts-ignore
import chaiHttp = require('chai-http');

// Mocks
import { teams } from '../mocks/exporter';

// types
import * as types from '../../types/exporter';

// app
import { app } from '../../app';

// Model
import * as models from '../../database/models/exporter';

// configurations
chai.use(chaiHttp);
const { expect } = chai;

describe('Sequência de testes sobre a rota "/teams"', function () {
  const PATH_ROOT = '/teams';
  const PATH_ID = '/teams/5';

  afterEach(sinon.restore);

  describe('Sequência de testes sobre a rota GET', function () {
    describe('Sequência para casos de sucesso', function () {
      const OK: types.Status = 200;

      it('Verifica se a rota raiz retorna todos os times corretamente', async function () {
        const buildModel = models.TeamModel.bulkBuild(teams);
        const fakeModel = sinon.stub(models.TeamModel, 'findAll').resolves(buildModel);

        const allTeams = await chai.request(app).get(PATH_ROOT);

        sinon.assert.calledOnce(fakeModel);
        expect(allTeams).to.have.status(OK);
        expect(allTeams.body).to.be.deep.equal(teams);
      });

      it('Verifica se a rota id retorna os dado do time corretamente', async function () {
        const buildModel = models.TeamModel.build(teams[4]);
        const fakeModel = sinon.stub(models.TeamModel, 'findByPk').resolves(buildModel);

        const team = await chai.request(app).get(PATH_ID);

        sinon.assert.calledOnce(fakeModel);
        expect(team).to.have.status(OK);
        expect(team.body).to.be.deep.equal(teams[4]);
      });
    });

    describe('Sequência para casos de falha', function () {
      const NOT_FOUND: types.Status = 404;

      it('Verifica se o status e mensagem caso não encontre o time pelo id', async function () {
        const fakeModel = sinon.stub(models.TeamModel, 'findByPk').resolves(null);

        const team = await chai.request(app).get(PATH_ID);

        sinon.assert.calledOnce(fakeModel);
        expect(team).to.have.status(NOT_FOUND);
        expect(team.body).to.be.deep.equal({ message: 'There is no team with such id!' });
      });
    });
  });
});
