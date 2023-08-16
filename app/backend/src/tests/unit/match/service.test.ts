// libraries
import * as chai from 'chai';
import * as sinon from 'sinon';
import { describe, it } from 'mocha';
import * as sinonChai from 'sinon-chai';

// mocks
import { matches, matchesEnded, matchesInProgress } from '../../mocks/exporter';

// models
import * as models from '../../../database/models/exporter';

// Repository
import { MatchRepository } from '../../../repository/exporter';

// Service
import { MatchService } from '../../../service/exporter';

// config
chai.use(sinonChai);
const { expect } = chai;

describe('Sequência de testes sobre a camada service da rota "/matches"', function () {
  const service = new MatchService();

  afterEach(sinon.restore);

  it('Verifica se a camada retorna a lista de todos os jogos', async function () {
    const buildModel = models.MatchModel.bulkBuild(
      matches,
      {
        include:
          [
            { model: models.TeamModel, as: 'homeTeam', attributes: { exclude: ['id'] } },
            { model: models.TeamModel, as: 'awayTeam', attributes: { exclude: ['id'] } },
          ],
      },
    );
    const fakeRepository = sinon.stub(MatchRepository.prototype, 'getAll').resolves(buildModel);

    const allMatches = await service.getAll();

    sinon.assert.calledOnce(fakeRepository);
    expect(allMatches).to.be.deep.equal(matches);
  });

  it('Verifica se a camada retorna a lista dos jogos não finalizados', async function () {
    const buildModel = models.MatchModel.bulkBuild(
      matchesInProgress,
      {
        include:
          [
            { model: models.TeamModel, as: 'homeTeam', attributes: { exclude: ['id'] } },
            { model: models.TeamModel, as: 'awayTeam', attributes: { exclude: ['id'] } },
          ],
      },
    );
    const fakeModel = sinon.stub(MatchRepository.prototype, 'getByProgress').resolves(buildModel);

    const all = await service.getByProgress(true);

    sinon.assert.calledOnce(fakeModel);
    expect(all).to.be.deep.equal(matchesInProgress);
  });

  it('Verifica se a camada retorna a lista dos jogos finalizados', async function () {
    const buildModel = models.MatchModel.bulkBuild(
      matchesEnded,
      {
        include:
          [
            { model: models.TeamModel, as: 'homeTeam', attributes: { exclude: ['id'] } },
            { model: models.TeamModel, as: 'awayTeam', attributes: { exclude: ['id'] } },
          ],
      },
    );
    const fakeModel = sinon.stub(MatchRepository.prototype, 'getByProgress').resolves(buildModel);

    const all = await service.getByProgress(false);

    sinon.assert.calledOnce(fakeModel);
    expect(all).to.be.deep.equal(matchesEnded);
  });
});
