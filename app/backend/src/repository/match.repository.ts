// interfaces
import * as interfaces from '../interfaces/exporter';

// classes
import * as classes from '../classes/exporter';

// types
import * as types from '../types/exporter';

// Model
import * as model from '../database/models/exporter';

export default class MatchRepository extends classes.Repository
  implements interfaces.IMatchRepository<model.MatchModel> {
  protected model = model.MatchModel;

  public async getAll(): Promise<model.MatchModel[]> {
    return this.model.findAll(
      {
        include:
          [
            { model: model.TeamModel, as: 'homeTeam', attributes: { exclude: ['id'] } },
            { model: model.TeamModel, as: 'awayTeam', attributes: { exclude: ['id'] } },
          ],
      },
    );
  }

  public async getByProgress(progress: boolean): Promise<model.MatchModel[]> {
    return this.model.findAll({
      where: { inProgress: progress },
      include:
        [
          { model: model.TeamModel, as: 'homeTeam', attributes: { exclude: ['id'] } },
          { model: model.TeamModel, as: 'awayTeam', attributes: { exclude: ['id'] } },
        ],
    });
  }

  public async getById(id: number): Promise<model.MatchModel | null> {
    return this.model.findByPk(id);
  }

  public async updateMatch(
    goals: types.match.GoalsUpdate,
    id: number,
  ): Promise<types.match.UpdateMatchStatus> {
    return this.model.update({
      awayTeamGoals: goals.awayTeamGoals,
      homeTeamGoals: goals.homeTeamGoals,
    }, { where: { id } });
  }

  public async finishMatch(id: number): Promise<types.match.UpdateMatchStatus> {
    return this.model.update({ inProgress: false }, { where: { id } });
  }
}
