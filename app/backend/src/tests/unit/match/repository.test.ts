// libraries
import * as chai from 'chai';
import * as sinon from 'sinon';
import { describe, it } from 'mocha';
import * as sinonChai from 'sinon-chai';

// mocks
import { matches } from '../../mocks/exporter';

// models
import * as models from '../../../database/models/exporter';

// Repository
import { MatchRepository } from '../../../repository/exporter';

// config
chai.use(sinonChai);
const { expect } = chai;

describe('Sequência de testes sobre a camada Repository da rota "/matches"', function () {
  const repository = new MatchRepository();

  it('Verifica se a camada retorna todos os matches', async function () {
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
    const fakeModel = sinon.stub(models.MatchModel, 'findAll').resolves(buildModel);

    const all = await repository.getAll();

    sinon.assert.calledOnce(fakeModel);
    expect(all).to.be.deep.equal(buildModel);

    sinon.restore();
  });
});
