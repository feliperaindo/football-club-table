// types
import * as types from '../types/exporter';
import * as models from '../database/models/exporter';

import { tablesTools } from '../helpers/exporter';

export default class HashMapTools {
  // Manager
  public static tableManager(
    teams: models.TeamModel[],
    matches: models.MatchModel[],
    filter?: types.Leader.filter,
  ): types.Leader.LeaderBoard[] {
    const hashTable = this.hashTableCreator(teams);

    this.filterTable(hashTable, matches, filter);

    return tablesTools.sortLeaderBoard(Array.from(hashTable.values()));
  }

  private static filterTable(
    hashTable: types.Leader.HashMap,
    matches: models.MatchModel[],
    filter?: types.Leader.filter,
  ) {
    switch (filter) {
      case 'home': return this.populateHome(matches, hashTable);
      case 'away': return this.populateAway(matches, hashTable);
      default: return this.populateTable(matches, hashTable);
    }
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
  private static populateHome(matches: models.MatchModel[], hashMap: types.Leader.HashMap): void {
    matches.forEach((match) => {
      const { awayTeamGoals, homeTeamGoals, homeTeam } = match;
      const home = homeTeam?.teamName as string;

      const homeUpdate = { team: home, scored: homeTeamGoals, taken: awayTeamGoals };

      tablesTools.updateGoalsScore(hashMap, homeUpdate);
      tablesTools.updateTotalGames(hashMap, homeUpdate);
      tablesTools.updatePointsAndGoalsBalance(hashMap, home);
      tablesTools.updateEfficiency(hashMap, home);
    });
  }

  private static populateAway(matches: models.MatchModel[], hashMap: types.Leader.HashMap): void {
    matches.forEach((match) => {
      const { awayTeamGoals, homeTeamGoals, awayTeam } = match;
      const away = awayTeam?.teamName as string;

      const awayUpdate = { team: away, scored: awayTeamGoals, taken: homeTeamGoals };

      tablesTools.updateGoalsScore(hashMap, awayUpdate);
      tablesTools.updateTotalGames(hashMap, awayUpdate);
      tablesTools.updatePointsAndGoalsBalance(hashMap, away);
      tablesTools.updateEfficiency(hashMap, away);
    });
  }

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
