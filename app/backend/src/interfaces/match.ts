// types
import * as types from '../types/exporter';

export default interface ITeamRepository<T> {
  getAll(): Promise<T[]>;

  getById(id: number): Promise<T | null>;

  getByProgress(progress: boolean): Promise<T[]>;

  createMatch(matchInfo: types.match.MatchPost): Promise<T>

  updateMatch(
    goals: types.match.GoalsUpdate,
    id: number,
  ): Promise<types.match.UpdateMatchStatus>;

  finishMatch(id: number): Promise<types.match.UpdateMatchStatus>;
}
