export default interface ITeamRepository<T> {
  getAll(): Promise<T[]>;
  getByPk(id: number): Promise<T | null>
}
