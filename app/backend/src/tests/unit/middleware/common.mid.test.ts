// Bibliotecas
import * as chai from 'chai';
import * as sinon from 'sinon';
import { describe, it } from 'mocha';
import * as sinonChai from 'sinon-chai';

// types
import { NextFunction, Request, Response } from 'express';
import * as types from '../../../types/exporter';

// utils
import { validators } from '../../../utils/exporter';

// Middleware a ser testado
import { CommonMid } from '../../../middleware/exporter';

// configurations
chai.use(sinonChai);
const { expect } = chai;

describe('Sequência de testes sobre o middleware Common', function () {
  // Status
  const BAD_REQUEST: types.Status = 400;
  const CUSTOM_ERROR_MESSAGE = 'Custom error message';
  const ERROR_TYPE: types.errors.ErrorHandler = {
    http: BAD_REQUEST,
    message: CUSTOM_ERROR_MESSAGE,
  };

  // Express
  const req = {} as Request;
  const res = {} as Response;
  let next: NextFunction;

  beforeEach(function () {
    next = sinon.stub().returns(null) as NextFunction;
    req.params = { id: '4' };
  });

  afterEach(sinon.restore);

  it('O método validador de id deve chamar a função next em caso de erro', async function () {
    const fakeValidator = sinon.stub(validators, 'validateId')
      .throws(function () { throw new Error(CUSTOM_ERROR_MESSAGE); });

    CommonMid.paramValidation(req, res, next);

    sinon.assert.calledOnce(fakeValidator);
    expect(next).to.have.been.calledOnceWith(ERROR_TYPE);
  });

  it('A classe deve chamar a função next sem parâmetros em caso de sucesso', function () {
    CommonMid.paramValidation(req, res, next);

    expect(next).to.have.been.calledWith();
  });
});
