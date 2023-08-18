// libraries
import * as chai from 'chai';
import * as sinon from 'sinon';
import { describe, it } from 'mocha';
import * as sinonChai from 'sinon-chai';

// mocks
import * as mocks from '../../mocks/exporter';

// models
import * as models from '../../../database/models/exporter';

// Repository
import { MatchRepository } from '../../../repository/exporter';

// config
chai.use(sinonChai);
const { expect } = chai;

describe('Sequência de testes sobre a camada Repository da rota "/matches"', function () {
  const repository = new MatchRepository();

  afterEach(sinon.restore);

  it('Se a camada retorna todos os matches', async function () {
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

    const all = await repository.getAll();

    sinon.assert.calledOnce(fakeModel);
    expect(all).to.be.deep.equal(buildModel);
  });

  it('Se a camada retorna apenas o matches não finalizados', async function () {
    const buildModel = models.MatchModel.bulkBuild(
      mocks.matchesInProgress,
      {
        include:
          [
            { model: models.TeamModel, as: 'homeTeam', attributes: { exclude: ['id'] } },
            { model: models.TeamModel, as: 'awayTeam', attributes: { exclude: ['id'] } },
          ],
      },
    );
    const fakeModel = sinon.stub(models.MatchModel, 'findAll').resolves(buildModel);

    const all = await repository.getByProgress(true);

    sinon.assert.calledOnce(fakeModel);
    expect(all).to.be.deep.equal(buildModel);
  });

  it('Se a camada retorna apenas os matches finalizados', async function () {
    const buildModel = models.MatchModel.bulkBuild(
      mocks.matchesEnded,
      {
        include:
          [
            { model: models.TeamModel, as: 'homeTeam', attributes: { exclude: ['id'] } },
            { model: models.TeamModel, as: 'awayTeam', attributes: { exclude: ['id'] } },
          ],
      },
    );
    const fakeModel = sinon.stub(models.MatchModel, 'findAll').resolves(buildModel);

    const all = await repository.getByProgress(false);

    sinon.assert.calledOnce(fakeModel);
    expect(all).to.be.deep.equal(buildModel);
  });

  it('Se a camada retorna o match id', async function () {
    const buildModel = models.MatchModel.build(mocks.matchesRaw[0]);
    const fakeModel = sinon.stub(models.MatchModel, 'findByPk').resolves(buildModel);

    const match = await repository.getById(mocks.matchesRaw[0].id);

    sinon.assert.calledOnce(fakeModel);
    expect(match).to.be.deep.equal(buildModel);
  });

  it('Se é possível criar um novo match', async function () {
    const buildModel = models.MatchModel.build(mocks.newMatches.registerModelMatch);
    const fakeModel = sinon.stub(models.MatchModel, 'create').resolves(buildModel);

    const newMatch = await repository.createMatch(mocks.newMatches.validMatch);

    sinon.assert.calledOnce(fakeModel);
    expect(newMatch).to.be.deep.equal(buildModel);
  });

  it('Se é possível atualizar uma partida em andamento', async function () {
    const fakeModel = sinon.stub(models.MatchModel, 'update').resolves([2]);

    const updateMatch = await repository.updateMatch({ awayTeamGoals: 2, homeTeamGoals: 4 }, 2);

    sinon.assert.calledOnce(fakeModel);
    expect(updateMatch).to.be.deep.equal([2]);
  });

  it('Se é possível finalizar uma partida', async function () {
    const fakeModel = sinon.stub(models.MatchModel, 'update').resolves([1]);

    const endMatch = await repository.finishMatch(4);

    sinon.assert.calledOnce(fakeModel);
    expect(endMatch).to.be.deep.equal([1]);
  });
});
