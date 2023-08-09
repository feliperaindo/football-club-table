// types
import AllTeams from '../types/Team/exporter';

// classes
import * as classes from '../classes/exporter';

// repository
import TeamRepository from '../repository/exporter';

export default class TeamService extends classes.Service {
  protected repository = new TeamRepository();

  public async getAll(): Promise<AllTeams[]> {
    const allTeams = await this.repository.getAll();
    return allTeams.map(({ id, teamName }) => ({ id, teamName }));
  }
}
