// Bibliotecas
import * as chai from 'chai';
import * as sinon from 'sinon';
import { describe, it } from 'mocha';
import * as sinonChai from 'sinon-chai';

// types
import { NextFunction, Request, Response } from 'express';
import * as types from '../../../types/exporter';

// mocks
import { newMatches } from '../../mocks/exporter';

// utils
import { validators } from '../../../utils/exporter';

// Middleware a ser testado
import { MatchMid } from '../../../middleware/exporter';

// configurations
chai.use(sinonChai);
const { expect } = chai;

describe('Sequência de testes sobre o middleware Match', function () {
  // Status
  const BAD_REQUEST: types.Status = 400;
  const UNPROCESSABLE_ENTITY: types.Status = 422;
  const CUSTOM_ERROR_MESSAGE = 'Custom error message';

  // Express
  const req = {} as Request;
  const res = {} as Response;
  let next: NextFunction;

  beforeEach(function () {
    next = sinon.stub().returns(null) as NextFunction;
    req.body = newMatches.validMatch;
  });

  afterEach(sinon.restore);

  it('O validador de goals deve chamar a função next em caso de erro', async function () {
    const fakeValidator = sinon.stub(validators, 'matchGoalFields')
      .throws(function () { throw new Error(CUSTOM_ERROR_MESSAGE); });

    MatchMid.updateValidation(req, res, next);

    sinon.assert.calledOnce(fakeValidator);
    expect(next).to.have.been.calledOnceWith({ http: BAD_REQUEST, message: CUSTOM_ERROR_MESSAGE });
  });

  it('O validador de matches deve chamar a função next caso faltem campos', function () {
    const fakeValidator = sinon.stub(validators, 'newMatchFields')
      .throws(function () { throw new Error(CUSTOM_ERROR_MESSAGE); });

    MatchMid.registerValidation(req, res, next);

    sinon.assert.calledOnce(fakeValidator);
    expect(next).to.have.been.calledOnceWith({ http: BAD_REQUEST, message: CUSTOM_ERROR_MESSAGE });
  });

  it('O validador de matches deve chamar a função next caso um time jogue contra si', function () {
    const fakeValidator = sinon.stub(validators, 'validateSameTeam')
      .throws(function () { throw new Error(CUSTOM_ERROR_MESSAGE); });

    MatchMid.registerValidation(req, res, next);

    sinon.assert.calledOnce(fakeValidator);
    expect(next).to.have.been.calledOnceWith({
      http: UNPROCESSABLE_ENTITY,
      message: CUSTOM_ERROR_MESSAGE,
    });
  });

  it('O validador de goals deve chamar a função next sem parâmetros em caso de sucesso', function () {
    MatchMid.updateValidation(req, res, next);

    expect(next).to.have.been.calledOnceWith();
  });

  it('A classe deve chamar a função next sem parâmetros em caso de sucesso', function () {
    MatchMid.registerValidation(req, res, next);

    expect(next).to.have.been.calledWith();
  });
});
