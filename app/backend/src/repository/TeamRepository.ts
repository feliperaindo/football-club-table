// interfaces
import ITeamRepository from '../interfaces/exporter';

// classes
import * as classes from '../classes/exporter';

// Model
import * as model from '../database/models/exporter';

export default class TeamRepository extends classes.Repository
  implements ITeamRepository<model.TeamModel> {
  protected model = model.TeamModel;

  public async getAll(): Promise<model.TeamModel[]> {
    return this.model.findAll();
  }
}
