// libraries
import { Response, Request } from 'express';

// classes
import * as classes from '../classes/exporter';

// service
import * as service from '../service/exporter';

export default class MatchController extends classes.Controller {
  protected service = new service.MatchService();

  public matchesByQuery(request: Request, response: Response): Promise<void> {
    const selectProgress = request.query?.inProgress ?? null;

    switch (selectProgress) {
      case 'true': return this.filteredMatches(response, true);
      case 'false': return this.filteredMatches(response, false);
      default: return this.allMatches(response);
    }
  }

  private async allMatches(response: Response): Promise<void> {
    const all = await this.service.getAll();
    response.status(this.ok).send(all);
  }

  private async filteredMatches(response: Response, progress: boolean): Promise<void> {
    const matches = await this.service.getByProgress(progress);
    response.status(this.ok).send(matches);
  }
}
