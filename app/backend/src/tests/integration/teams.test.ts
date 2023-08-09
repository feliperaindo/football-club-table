// libraries
import * as chai from 'chai';
import * as sinon from 'sinon';
// @ts-ignore
import chaiHttp = require('chai-http');

// Mocks
import teams from '../mocks/exporter';

// app
import { app } from '../../app';

// Model
import * as models from '../../database/models/exporter';

// configurations
chai.use(chaiHttp);
const { expect } = chai;

describe('Sequência de testes sobre a rota "/teams"', function () {
  describe('Sequência de testes sobre a rota GET', function () {
    const OK = 200;
    const PATH_ROOT = '/teams';

    it('Verifica se a rota raiz retorna todos os times corretamente', async function () {
      const buildModel = models.TeamModel.bulkBuild(teams);
      const fakeModel = sinon.stub(models.TeamModel, 'findAll').resolves(buildModel);

      const allTeams = await chai.request(app).get(PATH_ROOT);

      sinon.assert.calledOnce(fakeModel);
      expect(allTeams).to.have.status(OK);
      expect(allTeams.body).to.be.deep.equal(teams);
    });
  });
});
