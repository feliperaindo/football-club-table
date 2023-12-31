// types
import { match } from '../types/exporter';
import * as models from '../database/models/exporter';

// classes
import * as classes from '../classes/exporter';

// types
import * as types from '../types/exporter';

// repository
import * as repository from '../repository/exporter';

export default class MatchService extends classes.Service {
  private readonly zero: number = 0;

  protected readonly repository = new repository.MatchRepository();

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

  public async checkValidMatch(id: number): Promise<void> {
    const existMatch = await this.repository.getById(id);

    if (existMatch === null) { throw new Error('Match not found'); }

    if (!existMatch.inProgress) { throw new Error('Match already ended'); }
  }

  public async createMatch(info: types.match.MatchPost): Promise<types.match.MatchInfo> {
    const newMatch = await this.repository.createMatch(info);
    return { ...newMatch.dataValues };
  }

  public async updateScore(
    goals: types.match.GoalsUpdate,
    id: number,
  ): Promise<types.match.SuccessUpdate> {
    await this.repository.updateMatch(goals, id);
    return { message: 'Score updated' };
  }

  public async finishMatch(id: number): Promise<types.match.SuccessUpdate> {
    await this.repository.finishMatch(id);
    return { message: 'Finalizado' };
  }
}
