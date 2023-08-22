// interfaces
import * as interfaces from '../interfaces/exporter';

// classes
import * as classes from '../classes/exporter';

// types
import * as types from '../types/exporter';

// queries
import * as queries from './queries';

// Model
import * as model from '../database/models/exporter';

export default class LeaderRepository extends classes.Repository
  implements interfaces.ILeaderRepository {
  protected model = model.db;

  // Readers
  public async getLeaderBoard(): Promise<[types.Leader.LeaderBoard[]]> {
    return this.model.query(queries.QUERY_LEADER) as unknown as [types.Leader.LeaderBoard[]];
  }

  public async getAwayLeader(): Promise<[types.Leader.LeaderBoard[]]> {
    return this.model
      .query(queries.QUERY_AWAY_LEADER) as unknown as [types.Leader.LeaderBoard[]];
  }

  public async getHomeLeader(): Promise<[types.Leader.LeaderBoard[]]> {
    return this.model
      .query(queries.QUERY_HOME_LEADER) as unknown as [types.Leader.LeaderBoard[]];
  }
}
