// interfaces
import * as interfaces from '../interfaces/exporter';

// classes
import * as classes from '../classes/exporter';

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
}
