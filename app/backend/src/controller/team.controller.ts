// libraries
import { Response, Request, NextFunction } from 'express';

// types
import * as types from '../types/exporter';

// classes
import * as classes from '../classes/exporter';

// service
import * as service from '../service/exporter';

export default class TeamController extends classes.Controller {
  protected readonly service = new service.TeamService();

  constructor() {
    super();
    this.allTeams = this.allTeams.bind(this);
    this.teamById = this.teamById.bind(this);
  }

  public async allTeams(__request: Request, response: Response): Promise<void> {
    const all = await this.service.getAll();
    response.status(this.ok).send(all);
  }

  public async teamById(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = request.params;
      const team = await this.service.getById(+id);
      response.status(this.ok).send(team);
    } catch (e) {
      const { message } = e as types.errors.ErrorType;
      const error: types.errors.ErrorHandler = { message, http: this.notFound };
      next(error);
    }
  }
}
