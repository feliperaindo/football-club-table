// libraries
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as bcrypt from 'bcryptjs';
// @ts-ignore
import chaiHttp = require('chai-http');

// Mocks
import { login } from '../mocks/exporter';

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

  afterEach(sinon.restore);

  describe('Sequência de testes para casos de sucesso', function () {
    const OK_STATUS: types.Status = 200;

    it('Verifica se a rota retorna um token quando fornecido email e senha válidos', async function () {
      const buildModel = models.UserModel.build(login.userForTest);
      const fakeModel = sinon.stub(models.UserModel, 'findOne').resolves(buildModel);
      const fakeBcrypt = sinon.stub(bcrypt, 'compare').resolves(true);

      const result = await chai.request(app).post(PATH_ROOT).send(login.validUser);

      sinon.assert.calledOnce(fakeModel);
      sinon.assert.calledOnce(fakeBcrypt);
      expect(result).to.have.status(OK_STATUS);
      expect(result.body).to.have.property('token');
    });
  });

  describe('Sequência de testes para casos de falha', function () {
    // HTTP Status
    const NOT_FOUND_STATUS: types.Status = 404;
    const BAD_REQUEST_STATUS: types.Status = 400;

    // Error messages
    const MESSAGE_FIELD = 'message';
    const EMPTY_FIELDS = 'All fields must be filled';
    const INVALID_EMAIL_PASSWORD = 'Invalid email or password';

    it('Se lança mensagem e status de erro se o usuário não existir', async function () {
      const fakeModel = sinon.stub(models.UserModel, 'findOne').resolves(null);

      const result = await chai.request(app).post(PATH_ROOT).send(login.invalidEmail);

      sinon.assert.calledOnce(fakeModel);
      expect(result).to.have.status(NOT_FOUND_STATUS);
      expect(result.body).to.have.property(MESSAGE_FIELD, INVALID_EMAIL_PASSWORD);
    });

    it('Se lança mensagem e status de erro se a senha for inválida', async function () {
      const buildModel = models.UserModel.build(login.userForTest);
      const fakeModel = sinon.stub(models.UserModel, 'findOne').resolves(buildModel);
      const fakeBcrypt = sinon.stub(bcrypt, 'compare').resolves(false);

      const result = await chai.request(app).post(PATH_ROOT).send(login.invalidPassword);

      sinon.assert.calledOnce(fakeModel);
      sinon.assert.calledOnce(fakeBcrypt);
      expect(result).to.have.status(NOT_FOUND_STATUS);
      expect(result.body).to.have.property(MESSAGE_FIELD, INVALID_EMAIL_PASSWORD);
    });

    it('Se lança mensagem e status de erro caso não exista o campo password', async function () {
      const result = await chai.request(app).post(PATH_ROOT).send(login.inexistentPassword);

      expect(result).to.have.status(BAD_REQUEST_STATUS);
      expect(result.body).to.have.property(MESSAGE_FIELD, EMPTY_FIELDS);
    });

    it('Se lança mensagem e status de erro caso não exista o campo email', async function () {
      const result = await chai.request(app).post(PATH_ROOT).send(login.inexistentEmail);

      expect(result).to.have.status(BAD_REQUEST_STATUS);
      expect(result.body).to.have.property(MESSAGE_FIELD, EMPTY_FIELDS);
    });

    it('Se lança mensagem e status de erro caso o campo email esteja vazio', async function () {
      const result = await chai.request(app).post(PATH_ROOT).send(login.emptyEmail);

      expect(result).to.have.status(BAD_REQUEST_STATUS);
      expect(result.body).to.have.property(MESSAGE_FIELD, EMPTY_FIELDS);
    });

    it('Se lança mensagem e status de erro caso o campo password esteja vazio', async function () {
      const result = await chai.request(app).post(PATH_ROOT).send(login.emptyPassword);

      expect(result).to.have.status(BAD_REQUEST_STATUS);
      expect(result.body).to.have.property(MESSAGE_FIELD, EMPTY_FIELDS);
    });
  });
});
