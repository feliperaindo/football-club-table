// libraries
import { Response, Request } from 'express';

// types
import { Status } from '../types/HTTP/status';

// classes
import * as classes from '../classes/exporter';

// service
import * as service from '../service/exporter';

export default class TeamController extends classes.Controller {
  private readonly ok: Status = 200;

  protected service = new service.TeamService();

  public async allTeams(__request: Request, response: Response): Promise<void> {
    const all = await this.service.getAll();
    response.status(this.ok).send(all);
  }
}
