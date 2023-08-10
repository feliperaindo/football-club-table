// Bibliotecas
import * as chai from 'chai';
import * as sinon from 'sinon';
import { describe, it } from 'mocha';
import * as sinonChai from 'sinon-chai';
import * as chaiAsPromised from 'chai-as-promised';

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
chai.use(chaiAsPromised);
const { expect } = chai;

describe('Sequência de testes sobre a camada service da rota "/teams"', function () {
  const service = new TeamService();

  afterEach(sinon.restore);

  describe('Sequência de testes para casos de sucesso', function () {
    it('Verifica se a camada retorna os dados de maneira tratada', async function () {
      const buildModel = model.TeamModel.bulkBuild(teams);
      const fakeRepository = sinon.stub(TeamRepository.prototype, 'getAll').resolves(buildModel);

      const result = await service.getAll();

      sinon.assert.calledOnce(fakeRepository);
      expect(result).to.be.deep.equal(teams);
    });

    it('Verifica se a camada retorna os dados de um único time', async function () {
      const buildModel = model.TeamModel.build(teams[3]);
      const fakeRepository = sinon.stub(TeamRepository.prototype, 'getByPk').resolves(buildModel);

      const result = await service.getById(4);

      sinon.assert.calledOnce(fakeRepository);
      expect(result).to.be.deep.equal(teams[3]);
    });
  });

  describe('Sequência de testes para casos de falha', function () {
    it('Verifica é lançado um erro caso o repository retorne null', async function () {
      const fakeRepository = sinon.stub(TeamRepository.prototype, 'getByPk').resolves(null);

      const result = service.getById(1);

      sinon.assert.calledOnce(fakeRepository);
      return expect(result).to.eventually.be
        .rejectedWith(Error).to.have
        .ownProperty('message', 'Team not found');
    });
  });
});
