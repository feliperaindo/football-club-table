// types
import * as types from '../types/exporter';

export default interface ITeamRepository<T> {
  getAll(): Promise<T[]>;

  getByProgress(progress: boolean): Promise<T[]>;

  getById(id: number): Promise<T | null>;

  updateMatch(
    goals: types.match.GoalsUpdate,
    id: number,
  ): Promise<types.match.UpdateMatchStatus>;

  finishMatch(id: number): Promise<types.match.UpdateMatchStatus>;
}
