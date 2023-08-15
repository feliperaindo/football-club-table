// types
import { match } from '../types/exporter';

// classes
import * as classes from '../classes/exporter';

// repository
import * as repository from '../repository/exporter';

export default class MatchService extends classes.Service {
  protected repository = new repository.MatchRepository();

  public async getAll(): Promise<match.MatchInfo[]> {
    const allMatches = await this.repository.getAll();
    return allMatches.map((eachMatch) => ({
      id: eachMatch.id,
      homeTeamId: eachMatch.homeTeamId,
      homeTeamGoals: eachMatch.homeTeamGoals,
      awayTeamId: eachMatch.awayTeamId,
      awayTeamGoals: eachMatch.awayTeamGoals,
      inProgress: eachMatch.inProgress,
      homeTeam: { teamName: eachMatch.homeTeam?.teamName },
      awayTeam: { teamName: eachMatch.awayTeam?.teamName },
    }));
  }
}
