// Libraries
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as bcrypt from 'bcryptjs';
import { describe, it } from 'mocha';
import * as sinonChai from 'sinon-chai';
import * as chaiAsPromised from 'chai-as-promised';

// types
import * as types from '../../../types/exporter';

// Mocks
import { login, users } from '../../mocks/exporter';

// Model
import * as model from '../../../database/models/exporter';

// Repository
import { UserRepository } from '../../../repository/exporter';

// Service a ser testada
import { UserService } from '../../../service/exporter';

// configurations
chai.use(sinonChai);
chai.use(chaiAsPromised);
const { expect } = chai;

describe('Sequência de testes sobre a camada service da rota "/login"', function () {
  const service = new UserService();

  afterEach(sinon.restore);

  describe('Sequência de testes para casos de sucesso', function () {
    it('Verifica se a camada retorna um token caso email e senha estejam corretos', async function () {
      const buildModel = model.UserModel.build(users.admin as types.user.UserRegister);
      const fakeBcrypt = sinon.stub(bcrypt, 'compare').resolves(true);
      const fakeRepository = sinon.stub(UserRepository.prototype, 'getUser').resolves(buildModel);

      const result = await service.getToken(login.validUser);

      sinon.assert.calledOnce(fakeBcrypt);
      sinon.assert.calledOnce(fakeRepository);

      expect(result).to.have.key('token');
      expect(fakeRepository).to.have.been.calledWith(login.validUser.email);
      expect(fakeBcrypt).to.have.been.calledWith(login.validUser.password, buildModel.password);
    });

    it('Verifica se a camada retorna a função do usuário logado', async function () {
      const buildModel = model.UserModel.build(users.admin as types.user.UserRegister);
      const fakeRepository = sinon.stub(UserRepository.prototype, 'getUser').resolves(buildModel);

      const result = await service.getRole(users.admin.email);

      sinon.assert.calledOnce(fakeRepository);
      expect(result).to.have.property('role', users.admin.role);
    });
  });

  describe('Sequência de testes para casos de falha', function () {
    const ERROR_MESSAGE = 'Invalid email or password';

    it('Verifica se é lançado um erro caso o repository retorne "null"', function () {
      const fakeRepository = sinon.stub(UserRepository.prototype, 'getUser').resolves(null);

      const result = service.getToken(login.invalidEmail);

      sinon.assert.calledOnce(fakeRepository);
      return expect(result).to.eventually.be
        .rejectedWith(Error).to.have
        .ownProperty('message', ERROR_MESSAGE);
    });

    it('Verifica se é lançado um erro caso a senha não esteja correta', function () {
      sinon.stub(bcrypt, 'compare').resolves(false);
      const buildModel = model.UserModel.build(users.admin as types.user.UserRegister);
      const fakeRepository = sinon.stub(UserRepository.prototype, 'getUser').resolves(buildModel);

      const result = service.getToken(login.invalidPassword);

      sinon.assert.calledOnce(fakeRepository);
      return expect(result).to.eventually.be
        .rejectedWith(Error).to.have
        .ownProperty('message', ERROR_MESSAGE);
    });
  });
});
