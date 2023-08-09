// libraries
import * as express from 'express';

// router
import RouterManager from './routes/Router';

class App {
  public app: express.Express;

  private manager = new RouterManager();

  constructor() {
    this.app = express();

    this.config();

    this.app.use(this.manager.router);
  }

  private config(): void {
    const accessControl: express.RequestHandler = (__req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT,PATCH');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };

    this.app.use(express.json());
    this.app.use(accessControl);
  }

  public start(PORT: string | number): void {
    this.app.listen(PORT, () => console.log(`Running on port ${PORT}`));
  }
}

export { App };

// Essa segunda exportação é estratégica, e a execução dos testes de cobertura depende dela
export const { app } = new App();