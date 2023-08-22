// classes
import * as classes from '../classes/exporter';

// types
import { Leader } from '../types/exporter';

// repository
import * as repository from '../repository/exporter';

export default class LeaderBoardService extends classes.Service {
  protected repository = new repository.LeaderRepository();

  // public method
  public async getLeaderBoard(filter?: Leader.filter): Promise<Leader.LeaderBoard[]> {
    switch (filter) {
      case 'home': {
        const [leader] = await this.repository.getHomeLeader();
        return leader;
      }
      case 'away': {
        const [leader] = await this.repository.getAwayLeader();
        return leader;
      }
      default: {
        const [leader] = await this.repository.getLeaderBoard();
        return leader; }
    }
  }
}
