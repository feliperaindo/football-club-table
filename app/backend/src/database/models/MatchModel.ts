import {
  Model,
  DataTypes,
  InferAttributes,
  CreationOptional,
  InferCreationAttributes,
} from 'sequelize';

import sequelize from '.';

export default class MatchModel extends Model<InferAttributes<MatchModel>,
InferCreationAttributes<MatchModel>> {
  declare id: CreationOptional<number>;
  declare inProgress: boolean;
  declare homeTeamId: number;
  declare awayTeamId: number;
  declare homeTeamGoals: number;
  declare awayTeamGoals: number;
}

MatchModel.init(
  {
    id: { type: DataTypes.STRING, allowNull: false, primaryKey: true, autoIncrement: true },
    awayTeamId: { type: DataTypes.INTEGER, allowNull: false, field: 'away_team_id' },
    homeTeamId: { type: DataTypes.INTEGER, allowNull: false, field: 'home_team_id' },
    awayTeamGoals: { type: DataTypes.INTEGER, allowNull: false, field: 'away_team_goals' },
    homeTeamGoals: { type: DataTypes.INTEGER, allowNull: false, field: 'away_team_goals' },
    inProgress: { type: DataTypes.BOOLEAN, allowNull: false, field: 'in_progress' },
  },
  { sequelize, modelName: 'matches', timestamps: false },
);
