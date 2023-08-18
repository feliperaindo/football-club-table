// libraries
import * as chai from 'chai';
import * as sinon from 'sinon';
import { describe, it } from 'mocha';
import * as sinonChai from 'sinon-chai';
import * as chaiAsPromised from 'chai-as-promised';

// mocks
import * as mocks from '../../mocks/exporter';

// models
import * as models from '../../../database/models/exporter';

// Repository
import { MatchRepository } from '../../../repository/exporter';

// Service
import { MatchService } from '../../../service/exporter';

// config
chai.use(sinonChai);
chai.use(chaiAsPromised);
const { expect } = chai;

describe('Sequência de testes sobre a camada service da rota "/matches"', function () {
  const service = new MatchService();

  afterEach(sinon.restore);

  describe('Sequência para casos de sucesso', function () {
    it('Se a camada retorna a lista de todos os jogos', async function () {
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
      const fakeRepository = sinon.stub(MatchRepository.prototype, 'getAll').resolves(buildModel);

      const allMatches = await service.getAll();

      sinon.assert.calledOnce(fakeRepository);
      expect(allMatches).to.be.deep.equal(mocks.matches);
    });

    it('Se a camada retorna a lista dos jogos não finalizados', async function () {
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
      const fakeModel = sinon.stub(MatchRepository.prototype, 'getByProgress').resolves(buildModel);

      const all = await service.getByProgress(true);

      sinon.assert.calledOnce(fakeModel);
      expect(all).to.be.deep.equal(mocks.matchesInProgress);
    });

    it('Se a camada retorna a lista dos jogos finalizados', async function () {
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
      const fakeModel = sinon.stub(MatchRepository.prototype, 'getByProgress').resolves(buildModel);

      const all = await service.getByProgress(false);

      sinon.assert.calledOnce(fakeModel);
      expect(all).to.be.deep.equal(mocks.matchesEnded);
    });

    it('Se a camada não lança um erro caso tente atualizar uma partida em andamento', async function () {
      const buildModel = models.MatchModel.build(mocks.matchesRaw[1]);
      const fakeRepository = sinon.stub(MatchRepository.prototype, 'getById').resolves(buildModel);

      const nothing = service.checkValidMatch(mocks.matchesRaw[1].id);

      sinon.assert.calledOnce(fakeRepository);
      return expect(nothing).eventually.be.fulfilled.with.eq(undefined);
    });

    it('Se a camada retorna os dados do novo match cadastrado', async function () {
      const buildModel = models.MatchModel.build(mocks.newMatches.registerModelMatch);
      const fakeRepository = sinon.stub(MatchRepository.prototype, 'createMatch').resolves(buildModel);

      const newMatch = await service.createMatch(mocks.newMatches.validMatch);

      sinon.assert.calledOnce(fakeRepository);
      expect(newMatch).to.be.deep.equal(mocks.newMatches.registerModelMatch);
    });

    it('Se a camada retorna uma mensagem de sucesso após atualizar um match', async function () {
      const fakeRepository = sinon.stub(MatchRepository.prototype, 'updateMatch').resolves();

      const message = await service.updateScore({ awayTeamGoals: 2, homeTeamGoals: 4 }, 3);

      sinon.assert.calledOnce(fakeRepository);
      expect(message).to.be.deep.equal({ message: 'Score updated' });
    });

    it('Se a camada retorna uma mensagem de sucesso após finalizar uma match', async function () {
      const fakeRepository = sinon.stub(MatchRepository.prototype, 'finishMatch').resolves();

      const message = await service.finishMatch(3);

      sinon.assert.calledOnce(fakeRepository);
      expect(message).to.be.deep.equal({ message: 'Finalizado' });
    });
  });

  describe('Sequência para casos de falha', function () {
    it('Se a camada lança um erro caso não encontre o match pelo id', async function () {
      const fakeRepository = sinon.stub(MatchRepository.prototype, 'getById').resolves(null);

      const error = service.checkValidMatch(1);

      sinon.assert.calledOnce(fakeRepository);
      return expect(error).to.eventually.be.rejectedWith(Error, /^Match not found$/);
    });

    it('Se a camada lança um erro caso a partida já tenha sido finalizada', async function () {
      const buildModel = models.MatchModel.build(mocks.matchesRaw[0]);
      const fakeRepository = sinon.stub(MatchRepository.prototype, 'getById').resolves(buildModel);

      const error = service.checkValidMatch(mocks.matchesRaw[0].id);

      sinon.assert.calledOnce(fakeRepository);
      return expect(error).to.eventually.be.rejectedWith(Error, /^Match already ended$/);
    });
  });
});
