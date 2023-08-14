// Bibliotecas
import * as chai from 'chai';
import * as sinon from 'sinon';
import { describe, it } from 'mocha';
import * as sinonChai from 'sinon-chai';

// Mocks
import { teams } from '../../mocks/exporter';

// Model
import * as model from '../../../database/models/exporter';

// Repository a ser testada
import { TeamRepository } from '../../../repository/exporter';

// configurations
chai.use(sinonChai);
const { expect } = chai;

describe('Sequência de testes sobre a camada repository da rota "/teams"', function () {
  const repository = new TeamRepository();

  afterEach(sinon.restore);

  it('Verifica se a camada retorna um array de instâncias advinda da model', async function () {
    const buildModel = model.TeamModel.bulkBuild(teams);
    const fakeModel = sinon.stub(model.TeamModel, 'findAll').resolves(buildModel);

    const result = await repository.getAll();

    sinon.assert.calledOnce(fakeModel);
    expect(result).to.be.deep.equal(buildModel);
  });

  it('Verifica se a camada retorna um elemento da instância advinda da model', async function () {
    const buildModel = model.TeamModel.build(teams[0]);
    const fakeModel = sinon.stub(model.TeamModel, 'findByPk').resolves(buildModel);

    const result = await repository.getByPk(1);

    sinon.assert.calledOnce(fakeModel);
    expect(result).to.be.deep.equal(buildModel);
  });
});
