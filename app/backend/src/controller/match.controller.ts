// libraries
import { Request as Rq, Response as Rp, NextFunction as NF } from 'express';

// classes
import * as classes from '../classes/exporter';

// types
import * as types from '../types/exporter';

// service
import * as service from '../service/exporter';

export default class MatchController extends classes.Controller {
  protected service = new service.MatchService();

  constructor() {
    super();
    this.endMatch = this.endMatch.bind(this);
    this.allMatches = this.allMatches.bind(this);
    this.updateScore = this.updateScore.bind(this);
    this.matchesByQuery = this.matchesByQuery.bind(this);
    this.filteredMatches = this.filteredMatches.bind(this);
  }

  private async allMatches(response: Rp): Promise<void> {
    const all = await this.service.getAll();
    response.status(this.ok).send(all);
  }

  private async filteredMatches(response: Rp, progress: boolean): Promise<void> {
    const matches = await this.service.getByProgress(progress);
    response.status(this.ok).send(matches);
  }

  public matchesByQuery(request: Rq, response: Rp): Promise<void> {
    const selectProgress = request.query?.inProgress ?? null;

    switch (selectProgress) {
      case 'true': return this.filteredMatches(response, true);
      case 'false': return this.filteredMatches(response, false);
      default: return this.allMatches(response);
    }
  }

  public async updateScore(request: Rq, response: Rp, next: NF): Promise<void> {
    const { params: { id }, body } = request;

    try {
      await this.service.checkValidMatch(Number(id));
      const updated = await this.service.updateScore(body, Number(id));
      response.status(this.ok).send(updated);
    } catch (e) {
      const { message } = e as types.errors.ErrorType;
      const error: types.errors.ErrorHandler = { message, http: this.notFound };
      next(error);
    }
  }

  public async endMatch(request: Rq, response: Rp, next: NF): Promise<void> {
    const { id } = request.params;
    try {
      await this.service.checkValidMatch(Number(id));
      const finished = await this.service.finishMatch(Number(id));
      response.status(this.ok).send(finished);
    } catch (e) {
      const { message } = e as types.errors.ErrorType;
      const error: types.errors.ErrorHandler = { message, http: this.notFound };
      next(error);
    }
  }
}
