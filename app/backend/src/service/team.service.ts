// types
import { Team } from '../types/exporter';

// classes
import * as classes from '../classes/exporter';

// repository
import TeamRepository from '../repository/exporter';

export default class TeamService extends classes.Service {
  protected repository = new TeamRepository();

  public async getAll(): Promise<Team[]> {
    const allTeams = await this.repository.getAll();
    return allTeams.map(({ id, teamName }) => ({ id, teamName }));
  }

  public async getById(id: number): Promise<Team> {
    const team = await this.repository.getByPk(id);

    if (team === null) {
      throw new Error('Team not found');
    }
    return { id: team.id, teamName: team.teamName };
  }
}