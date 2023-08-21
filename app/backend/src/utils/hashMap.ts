// types
import * as types from '../types/exporter';
import * as models from '../database/models/exporter';

import { tablesTools } from '../helpers/exporter';

export default class HashMapTools {
  // Manager
  public static tableManager(
    teams: models.TeamModel[],
    matches: models.MatchModel[],
  ): types.Leader.LeaderBoard[] {
    const hashTable = this.hashTableCreator(teams);
    this.populateTable(matches, hashTable);

    return tablesTools.sortLeaderBoard(Array.from(hashTable.values()));
  }

  // Table creators
  private static hashTableCreator(teams: models.TeamModel[]): types.Leader.HashMap {
    const hashMap = new Map<string, types.Leader.LeaderBoard>();
    teams.forEach(({ teamName }) => {
      hashMap.set(teamName, tablesTools.leaderObjCreator(teamName));
    });
    return hashMap;
  }

  // Responsible for populate table
  private static populateTable(matches: models.MatchModel[], hashMap: types.Leader.HashMap): void {
    matches.forEach((match) => {
      const { awayTeamGoals, homeTeamGoals, homeTeam, awayTeam } = match;
      const home = homeTeam?.teamName as string;
      const away = awayTeam?.teamName as string;

      const homeUpdate = { team: home, scored: homeTeamGoals, taken: awayTeamGoals };
      const awayUpdate = { team: away, scored: awayTeamGoals, taken: homeTeamGoals };

      tablesTools.updateGoalsScore(hashMap, homeUpdate);
      tablesTools.updateGoalsScore(hashMap, awayUpdate);
      tablesTools.updateTotalGames(hashMap, homeUpdate);
      tablesTools.updateTotalGames(hashMap, awayUpdate);
      tablesTools.updatePointsAndGoalsBalance(hashMap, home);
      tablesTools.updatePointsAndGoalsBalance(hashMap, away);
      tablesTools.updateEfficiency(hashMap, home);
      tablesTools.updateEfficiency(hashMap, away);
    });
  }
}
