export default interface ITeamRepository<T> {
  getAll(): Promise<T[]>;
  getByProgress(progress: boolean): Promise<T[]>
}
