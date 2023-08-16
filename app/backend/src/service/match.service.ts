// types
import { match } from '../types/exporter';
import * as models from '../database/models/exporter';

// classes
import * as classes from '../classes/exporter';

// repository
import * as repository from '../repository/exporter';

export default class MatchService extends classes.Service {
  protected repository = new repository.MatchRepository();

  private static createMatchObj(matches: models.MatchModel[]): match.MatchInfo[] {
    return matches.map((eachMatch) => ({
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

  public async getAll(): Promise<match.MatchInfo[]> {
    const allMatches = await this.repository.getAll();
    return MatchService.createMatchObj(allMatches);
  }

  public async getByProgress(progress: boolean): Promise<match.MatchInfo[]> {
    const matchesByProgress = await this.repository.getByProgress(progress);
    return MatchService.createMatchObj(matchesByProgress);
  }
}
