// types
import * as models from '../database/models/exporter';

// classes
import * as classes from '../classes/exporter';

// types
import { Leader } from '../types/exporter';

// repository
import * as repository from '../repository/exporter';

export default class LeaderBoardService extends classes.Service {
  protected readonly repository = new repository.MatchRepository();
  private readonly teamRepository = new repository.TeamRepository();

  private static leaderObjCreator(teamName: string): Leader.LeaderBoard {
    return {
      name: teamName,
      totalPoints: 0,
      totalGames: 0,
      totalVictories: 0,
      totalDraws: 0,
      totalLosses: 0,
      goalsFavor: 0,
      goalsOwn: 0,
      goalsBalance: 0,
      efficiency: '0',
    };
  }

  private static hashTableCreator(teams: models.TeamModel[]): Leader.HashMap {
    const hashMap = new Map<string, Leader.LeaderBoard>();
    teams.forEach(({ teamName }) => { hashMap.set(teamName, this.leaderObjCreator(teamName)); });
    return hashMap;
  }

  private static updateGoalsScore(hashMap: Leader.HashMap, info: Leader.GoalInfo): void {
    const { team, scored, taken } = info;
    const oldInfo = hashMap.get(team) as Leader.LeaderBoard;
    hashMap.set(
      team,
      { ...oldInfo,
        goalsFavor: oldInfo.goalsFavor + scored,
        goalsOwn: oldInfo.goalsOwn + taken,
      },
    );
  }

  private static checkWinner(scored: number, taken: number): Leader.ScoreBoard {
    switch (true) {
      case (scored > taken): return { draw: 0, lose: 0, victory: 1 };
      case (scored < taken): return { draw: 0, lose: 1, victory: 0 };
      default: return { draw: 1, lose: 0, victory: 0 };
    }
  }

  private static updateTotalGames(hashMap: Leader.HashMap, info: Leader.GoalInfo): void {
    const { team, scored, taken } = info;
    const { draw, victory, lose } = this.checkWinner(scored, taken);
    const oldInfo = hashMap.get(team) as Leader.LeaderBoard;
    hashMap.set(
      team,
      { ...oldInfo,
        totalGames: oldInfo.totalGames + 1,
        totalLosses: oldInfo.totalLosses + lose,
        totalDraws: oldInfo.totalDraws + draw,
        totalVictories: oldInfo.totalVictories + victory,
      },
    );
  }

  private static updatePointsAndGoalsBalance(hashMap: Leader.HashMap, team: string): void {
    const oldInfo = hashMap.get(team) as Leader.LeaderBoard;
    hashMap.set(
      team,
      { ...oldInfo,
        totalPoints: ((oldInfo.totalVictories * 3) + oldInfo.totalDraws),
        goalsBalance: (oldInfo.goalsFavor - oldInfo.goalsOwn),
      },
    );
  }

  private static updateEfficiency(hashMap: Leader.HashMap, team: string): void {
    const oldInfo = hashMap.get(team) as Leader.LeaderBoard;
    hashMap.set(
      team,
      { ...oldInfo,
        efficiency: ((oldInfo.totalPoints / (oldInfo.totalGames * 3)) * 100)
          .toFixed(2)
          .toString(),
      },
    );
  }

  private static populateTable(matches: models.MatchModel[], hashMap: Leader.HashMap): void {
    matches.forEach((match) => {
      const { awayTeamGoals, homeTeamGoals, homeTeam, awayTeam } = match;
      const home = homeTeam?.teamName as string;
      const away = awayTeam?.teamName as string;

      this.updateGoalsScore(hashMap, { team: home, scored: homeTeamGoals, taken: awayTeamGoals });
      this.updateGoalsScore(hashMap, { team: away, scored: awayTeamGoals, taken: homeTeamGoals });

      this.updateTotalGames(hashMap, { team: home, scored: homeTeamGoals, taken: awayTeamGoals });
      this.updateTotalGames(hashMap, { team: away, scored: awayTeamGoals, taken: homeTeamGoals });

      this.updatePointsAndGoalsBalance(hashMap, home);
      this.updatePointsAndGoalsBalance(hashMap, away);

      this.updateEfficiency(hashMap, home);
      this.updateEfficiency(hashMap, away);
    });
  }

  private static tableManager(
    teams: models.TeamModel[],
    matches: models.MatchModel[],
  ): Leader.LeaderBoard[] {
    const hashTable = this.hashTableCreator(teams);
    this.populateTable(matches, hashTable);

    return Array.from(hashTable.values());
  }

  private getAllEndedMatches(): Promise<models.MatchModel[]> {
    return this.repository.getByProgress(false);
  }

  private getAllTeams(): Promise<models.TeamModel[]> {
    return this.teamRepository.getAll();
  }

  public async getLeaderBoard(): Promise<Leader.LeaderBoard[]> {
    const allTeams = await this.getAllTeams();
    const allMatches = await this.getAllEndedMatches();
    return LeaderBoardService.tableManager(allTeams, allMatches);
  }

  // public async getHomeLeaderBoard(progress: boolean): Promise<types.LeaderBoard[]> {
  //   const allMatches = await this.getModelTable();
  //   return this.createTable(matchesByProgress);
  // }
}
