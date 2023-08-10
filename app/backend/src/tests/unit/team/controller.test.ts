// Bibliotecas
import * as chai from 'chai';
import * as sinon from 'sinon';
import { describe, it } from 'mocha';
import * as sinonChai from 'sinon-chai';

// types
import { Request, Response } from 'express';
import * as types from '../../../types/exporter';

// Mocks
import teams from '../../mocks/exporter';

// Service
import TeamService from '../../../service/exporter';

// Controller a ser testado
import TeamController from '../../../controller/exporter';

// configurations
chai.use(sinonChai);
const { expect } = chai;

describe('Sequência de testes sobre a camada controller da rota "/teams"', function () {
  const OK_STATUS: types.Status = 200;
  const req = {} as Request;
  const res = {} as Response;
  const controller = new TeamController();

  beforeEach(function () {
    sinon.restore();
    res.status = sinon.stub().returns(res);
    res.send = sinon.stub().returns(res);
  });

  it('Verifica se a resposta retorna status OK e todos os times cadastrados', async function () {
    const fakeService = sinon.stub(TeamService.prototype, 'getAll').resolves(teams);

    await controller.allTeams(req, res);

    sinon.assert.calledOnce(fakeService);
    expect(res.send).to.have.been.calledWith(teams);
    expect(res.status).to.have.been.calledWith(OK_STATUS);
  });

  it('Verifica se true é true', function () {
    expect(true).to.be.eq(true);
  });
});
