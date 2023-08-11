// libraries
// import bcrypt from 'bcryptjs';
import * as chai from 'chai';
import * as sinon from 'sinon';
// @ts-ignore
import chaiHttp = require('chai-http');

// Mocks
import teams from '../mocks/exporter';

// types
import * as types from '../../types/exporter';

// app
import { app } from '../../app';

// Model
import * as models from '../../database/models/exporter';

// configurations
chai.use(chaiHttp);
const { expect } = chai;

describe('Sequência de testes sobre a rota /login', function () {
  const PATH_ROOT = '/login';

  describe('Sequência de testes para casos de sucesso', function () {
    const VALID_USER = { email: 'user@user.com', password: 'secret_user' };
    const OK_STATUS: types.Status = 200;

    it('Verifica se a rota retorna um token quando fornecido email e senha válidos', async function () {
      const result = await chai.request(app).post(PATH_ROOT).send(VALID_USER);

      expect(result).to.have.status(OK_STATUS);
      expect(result.body).to.have.property('token');
    });
  });

  // describe('Sequência de testes para casos de falha', function () {
  //   const INVALID_EMAIL = { email: 'invalid_email', password: 'valid password' };

  //   it('Verifica se a rota lança mensagem e status de erro caso não informado email', async function () {
  //     const result = await chai.request(app).post(PATH_ROOT).send();
  //   });
  // });
});
