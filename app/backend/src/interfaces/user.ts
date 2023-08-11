export default interface IUserRepository<T> {
  getUser(email: string): Promise<T | null>;
}
