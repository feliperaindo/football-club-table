// libraries
import * as chai from 'chai';
import { describe, it } from 'mocha';

// Checkers
import checkers from '../../../helpers/checkers';

// config
const { expect } = chai;

describe('Sequência de testes sobre as funções de auxílio', function () {
  it('Verifica se a classe valida as chaves do objeto corretamente', function () {
    const obj = { key: 'value' };
    const keyName = 'key';
    const notExistKey = 'notExistKey';

    expect(checkers.checkKeys<typeof obj>(obj, keyName)).to.be.eq(true);
    expect(checkers.checkKeys<typeof obj>(obj, notExistKey)).to.be.eq(false);
  });

  it('Verifica se a classe valida corretamente se uma string é vazia', function () {
    const fullString = 'string not empty';
    const emptyString = '';

    expect(checkers.isEmpty(fullString)).to.be.eq(false);
    expect(checkers.isEmpty(emptyString)).to.be.eq(true);
  });

  it('Verifica se a classe valida corretamente um email', function () {
    const validMail = 'valid@valid.com';
    const invalidMail = 'invalid.mail';
    const invalidMail2 = 'invalid@mail';

    expect(checkers.checkEmail(validMail)).to.be.eq(true);
    expect(checkers.checkEmail(invalidMail)).to.be.eq(false);
    expect(checkers.checkEmail(invalidMail2)).to.be.eq(false);
  });

  it('Verifica se a classe valida uma senha corretamente (acima de 5 caracteres)', function () {
    const validPassword = 'validPassword';
    const invalidPassword = '123';

    expect(checkers.checkPassword(validPassword)).to.be.eq(true);
    expect(checkers.checkPassword(invalidPassword)).to.be.eq(false);
  });
});
