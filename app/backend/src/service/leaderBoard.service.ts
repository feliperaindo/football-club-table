// types
import * as models from '../database/models/exporter';

// classes
import * as classes from '../classes/exporter';

// types
import { Leader } from '../types/exporter';

// utils
import * as utils from '../utils/exporter';

// repository
import * as repository from '../repository/exporter';

export default class LeaderBoardService extends classes.Service {
  protected readonly repository = new repository.MatchRepository();
  private readonly teamRepository = new repository.TeamRepository();

  // Repositories requesters
  private getAllTeams(): Promise<models.TeamModel[]> {
    return this.teamRepository.getAll();
  }

  private getAllEndedMatches(): Promise<models.MatchModel[]> {
    return this.repository.getByProgress(false);
  }

  // public method
  public async getLeaderBoard(): Promise<Leader.LeaderBoard[]> {
    const allTeams = await this.getAllTeams();
    const allMatches = await this.getAllEndedMatches();
    return utils.hashMap.tableManager(allTeams, allMatches);
  }

  // public async getHomeLeaderBoard(progress: boolean): Promise<types.LeaderBoard[]> {
  //   const allMatches = await this.getModelTable();
  //   return this.createTable(matchesByProgress);
  // }
}
