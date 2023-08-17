// types
import { Team } from '../types/exporter';

// classes
import * as classes from '../classes/exporter';

// repository
import * as repository from '../repository/exporter';

export default class TeamService extends classes.Service {
  protected readonly repository = new repository.TeamRepository();

  public async getAll(): Promise<Team[]> {
    const allTeams = await this.repository.getAll();
    return allTeams.map(({ id, teamName }) => ({ id, teamName }));
  }

  public async getById(id: number): Promise<Team> {
    const team = await this.repository.getByPk(id);

    if (team === null) {
      throw new Error('There is no team with such id!');
    }
    return { id: team.id, teamName: team.teamName };
  }
}
