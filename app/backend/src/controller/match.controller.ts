// libraries
import { Response, Request } from 'express';

// classes
import * as classes from '../classes/exporter';

// service
import * as service from '../service/exporter';

export default class MatchController extends classes.Controller {
  protected service = new service.MatchService();

  public async allMatches(__request: Request, response: Response): Promise<void> {
    const all = await this.service.getAll();
    response.status(this.ok).send(all);
  }
}
