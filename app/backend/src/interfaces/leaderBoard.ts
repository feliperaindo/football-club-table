// types
import * as types from '../types/exporter';

export default interface ILeaderRepository {
  getLeaderBoard(): Promise<[types.Leader.LeaderBoard[]]>

  getHomeLeader(): Promise<[types.Leader.LeaderBoard[]]>

  getAwayLeader(): Promise<[types.Leader.LeaderBoard[]]>
}
