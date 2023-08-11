import {
  Model,
  DataTypes,
  InferAttributes,
  CreationOptional,
  InferCreationAttributes,
} from 'sequelize';

import sequelize from '.';

export default class TeamModel extends Model<InferAttributes<TeamModel>,
InferCreationAttributes<TeamModel>> {
  declare id: CreationOptional<number>;
  declare teamName: string;
}

TeamModel.init(
  {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    teamName: { type: DataTypes.STRING, allowNull: false, field: 'team_name' },
  },
  { sequelize, modelName: 'teams', timestamps: false },
);
