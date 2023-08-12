// libraries
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as bcrypt from 'bcryptjs';
// @ts-ignore
import chaiHttp = require('chai-http');

// Mocks
import { login, users, token } from '../mocks/exporter';

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
  // Paths
  const PATH_ROOT = '/login';
  const PATH_ROLE = '/login/role';

  // HTTP Status
  const OK_STATUS: types.Status = 200;
  const BAD_REQUEST_STATUS: types.Status = 400;
  const UNAUTHORIZED_STATUS: types.Status = 401;

  // Header
  const AUTHORIZATION = 'authorization';

  // Body
  const MESSAGE_FIELD = 'message';

  afterEach(sinon.restore);

  describe('Sequência de testes para casos de sucesso', function () {
    it('Verifica se a rota "/login" retorna um token quando fornecido email e senha válidos', async function () {
      const buildModel = models.UserModel.build(login.userForTest as types.user.UserRegister);
      const fakeModel = sinon.stub(models.UserModel, 'findOne').resolves(buildModel);
      const fakeBcrypt = sinon.stub(bcrypt, 'compare').resolves(true);

      const result = await chai.request(app).post(PATH_ROOT).send(login.validUser);

      sinon.assert.calledOnce(fakeModel);
      sinon.assert.calledOnce(fakeBcrypt);
      expect(result).to.have.status(OK_STATUS);
      expect(result.body).to.have.property('token');
    });

    it('Verifica se a rota "/login/role" retorna a função do usuário', async function () {
      const { body } = await chai.request(app).post(PATH_ROOT).send(users.admin);
      const response = await chai.request(app)
        .get(PATH_ROLE)
        .set(AUTHORIZATION, ` Bearer ${body.token}`);

      expect(response).to.have.status(OK_STATUS);
      expect(response.body).to.have.property('role', users.admin.role);
    });
  });

  describe('Sequência de testes para casos de falha na rota "/login"', function () {
    // Error messages
    const EMPTY_FIELDS = 'All fields must be filled';
    const INVALID_EMAIL_PASSWORD = 'Invalid email or password';

    it('Se lança mensagem e status de erro caso não exista o campo password', async function () {
      const result = await chai.request(app).post(PATH_ROOT).send(login.inexistentPassword);

      expect(result).to.have.status(BAD_REQUEST_STATUS);
      expect(result.body).to.have.property(MESSAGE_FIELD, EMPTY_FIELDS);
    });

    it('Se lança mensagem e status de erro caso o campo password esteja vazio', async function () {
      const result = await chai.request(app).post(PATH_ROOT).send(login.emptyPassword);

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

    it('Se lança mensagem e status de erro caso email não seja um email', async function () {
      const result = await chai.request(app).post(PATH_ROOT).send(login.unformattedEmail);

      expect(result).to.have.status(UNAUTHORIZED_STATUS);
      expect(result.body).to.have.property(MESSAGE_FIELD, INVALID_EMAIL_PASSWORD);
    });

    it('Se lança mensagem e status de erro caso password seja menor que 6 caracteres', async function () {
      const result = await chai.request(app).post(PATH_ROOT).send(login.shortPassword);

      expect(result).to.have.status(UNAUTHORIZED_STATUS);
      expect(result.body).to.have.property(MESSAGE_FIELD, INVALID_EMAIL_PASSWORD);
    });

    it('Se lança mensagem e status de erro se o usuário não existir', async function () {
      const fakeModel = sinon.stub(models.UserModel, 'findOne').resolves(null);

      const result = await chai.request(app).post(PATH_ROOT).send(login.invalidEmail);

      sinon.assert.calledOnce(fakeModel);
      expect(result).to.have.status(UNAUTHORIZED_STATUS);
      expect(result.body).to.have.property(MESSAGE_FIELD, INVALID_EMAIL_PASSWORD);
    });

    it('Se lança mensagem e status de erro se a senha for inválida', async function () {
      const buildModel = models.UserModel.build(login.userForTest as types.user.UserRegister);
      const fakeModel = sinon.stub(models.UserModel, 'findOne').resolves(buildModel);
      const fakeBcrypt = sinon.stub(bcrypt, 'compare').resolves(false);

      const result = await chai.request(app).post(PATH_ROOT).send(login.invalidPassword);

      sinon.assert.calledOnce(fakeModel);
      sinon.assert.calledOnce(fakeBcrypt);
      expect(result).to.have.status(UNAUTHORIZED_STATUS);
      expect(result.body).to.have.property(MESSAGE_FIELD, INVALID_EMAIL_PASSWORD);
    });
  });

  describe('Sequência de testes para casos de falha na rota "/login/role"', function () {
    const TOKEN_NOT_FOUND = 'Token not found';
    const TOKEN_INVALID = 'Token must be a valid token';

    it('Verifica se lança um erro e status correto em caso de não fornecer um token', async function () {
      const result = await chai.request(app).get(PATH_ROLE);

      expect(result).to.have.status(UNAUTHORIZED_STATUS);
      expect(result.body).to.have.property(MESSAGE_FIELD, TOKEN_NOT_FOUND);
    });

    it('Verifica se lança um erro e status correto em caso de fornecer um token inválido', async function () {
      const result = await chai.request(app)
        .get(PATH_ROLE)
        .set(AUTHORIZATION, token.invalidToken);

      expect(result).to.have.status(UNAUTHORIZED_STATUS);
      expect(result.body).to.have.property(MESSAGE_FIELD, TOKEN_INVALID);
    });
  });
});
