// Bibliotecas
import * as chai from 'chai';
import * as sinon from 'sinon';
import { describe, it } from 'mocha';
import * as sinonChai from 'sinon-chai';

// Mocks
import teams from '../../mocks/exporter';

// Model
import * as model from '../../../database/models/exporter';

// Repository
import TeamRepository from '../../../repository/exporter';

// Service a ser testada
import TeamService from '../../../service/exporter';

// configurations
chai.use(sinonChai);
const { expect } = chai;

describe('Sequência de testes sobre a camada service da rota "/teams"', function () {
  const service = new TeamService();

  it('Verifica se a camada retorna os dados de maneira tratada', async function () {
    const buildModel = model.TeamModel.bulkBuild(teams);
    const fakeRepository = sinon.stub(TeamRepository.prototype, 'getAll').resolves(buildModel);

    const result = await service.getAll();

    sinon.assert.calledOnce(fakeRepository);
    expect(result).to.be.deep.equal(teams);
  });
});
