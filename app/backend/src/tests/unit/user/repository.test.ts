// Libraries
import * as chai from 'chai';
import * as sinon from 'sinon';
import { describe, it } from 'mocha';
import * as sinonChai from 'sinon-chai';

// types
import * as types from '../../../types/exporter';

// Mocks
import { users } from '../../mocks/exporter';

// Model
import * as model from '../../../database/models/exporter';

// Repository a ser testada
import { UserRepository } from '../../../repository/exporter';

// configurations
chai.use(sinonChai);
const { expect } = chai;

describe('Sequência de testes sobre a camada repository da rota "/login"', function () {
  const repository = new UserRepository();

  it('Verifica se a camada retorna a instância de um usuário', async function () {
    const buildModel = model.UserModel.build(users.user as types.user.UserRegister);
    const fakeModel = sinon.stub(model.UserModel, 'findOne').resolves(buildModel);

    const result = await repository.getUser(users.user.email);

    sinon.assert.calledOnce(fakeModel);
    expect(result).to.be.deep.equal(buildModel);

    sinon.restore();
  });
});
