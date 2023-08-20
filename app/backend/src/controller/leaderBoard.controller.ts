// libraries
import { Request, Response } from 'express';

// classes
import * as classes from '../classes/exporter';

// service
import * as service from '../service/exporter';

export default class LeaderBoardController extends classes.Controller {
  protected readonly service = new service.LeaderBoardService();

  constructor() {
    super();
    this.requestLeaderBoard = this.requestLeaderBoard.bind(this);
  }

  public async requestLeaderBoard(__request: Request, response: Response): Promise<void> {
    const leaderBoard = await this.service.getLeaderBoard();
    response.status(this.ok).send(leaderBoard);
  }
}
