// libraries
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { describe, it } from 'mocha';

// types
import { Request, Response } from 'express';
import * as types from '../../../types/exporter';

// mocks
import { matches } from '../../mocks/exporter';

// service
import { MatchService } from '../../../service/exporter';

// controller
import { MatchController } from '../../../controller/exporter';

// config
chai.use(sinonChai);
const { expect } = chai;

describe('Sequência de testes sobre a camada controller da rota "/matches"', function () {
  // Status
  const OK_STATUS: types.Status = 200;
  // const NOT_FOUND_STATUS: types.Status = 404;

  // Express
  const req = {} as Request;
  const res = {} as Response;

  // controller
  const controller = new MatchController();

  it('Verifica se o método response com status "OK" e informa todos os matches', async function () {
    res.status = sinon.stub().returns(res);
    res.send = sinon.stub().returns(res);

    const fakeService = sinon.stub(MatchService.prototype, 'getAll').resolves(matches);

    await controller.allMatches(req, res);

    sinon.assert.calledOnce(fakeService);
    expect(res.status).to.have.been.calledWith(OK_STATUS);
    expect(res.send).to.have.been.calledOnceWith(matches);
  });
});
