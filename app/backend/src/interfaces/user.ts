export default interface IUserRepository<T> {
  getOne(): Promise<T>;
}
