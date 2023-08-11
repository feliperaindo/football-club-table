export default interface ITeamRepository<T> {
  getAll(): Promise<T[]>;
}
