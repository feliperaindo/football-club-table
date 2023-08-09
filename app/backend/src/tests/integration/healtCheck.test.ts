// Libraries
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

// App
import { app } from '../../app';

// configurations
chai.use(chaiHttp);
const { expect } = chai;

describe('Sequência de testes sobre a rota "/"', function () {
  const PATH_ROOT = '/';

  it('Verifica se a aplicação está no ar através da rota de healthCheck', async function () {
    const response = await chai.request(app).get(PATH_ROOT);

    expect(response.body).to.be.deep.equal({ ok: true });
  });
});
