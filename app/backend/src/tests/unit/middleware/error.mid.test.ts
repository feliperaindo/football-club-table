// Bibliotecas
import * as chai from 'chai';
import * as sinon from 'sinon';
import { describe, it } from 'mocha';
import * as sinonChai from 'sinon-chai';

// types
import { NextFunction, Request, Response } from 'express';
import * as types from '../../../types/exporter';

// Middleware a ser testado
import { ErrorMid } from '../../../middleware/exporter';

// configurations
chai.use(sinonChai);
const { expect } = chai;

describe('Sequência de testes sobre o middleware Error', function () {
  // Status
  const NOT_FOUND_STATUS: types.Status = 404;
  const message = 'Minha mensagem de erro personalizada';
  const Error: types.errors.ErrorHandler = { http: NOT_FOUND_STATUS, message };

  // Express
  const req = {} as Request;
  const res = {} as Response;
  let next: NextFunction;

  it('Verifica se o middleware devolve uma resposta com mensagem e status', function () {
    res.status = sinon.stub().returns(res);
    res.send = sinon.stub().returns(res);
    next = sinon.stub().returns(null) as NextFunction;

    ErrorMid.errorHandler(Error, req, res, next);

    expect(res.send).to.have.been.calledWith({ message: Error.message });
    expect(res.status).to.have.been.calledWith(Error.http);

    sinon.restore();
  });
});
