// types
import {
  Model,
  DataTypes,
  InferAttributes,
  CreationOptional,
  InferCreationAttributes,
} from 'sequelize';
import * as types from '../../types/exporter';

// Sequelize
import sequelize from '.';

export default class UserModel extends Model<InferAttributes<UserModel>,
InferCreationAttributes<UserModel>> {
  declare id: CreationOptional<number>;
  declare role: types.user.Roles;
  declare email: string;
  declare username: string;
  declare password: string;
}

UserModel.init(
  {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    role: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    username: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, modelName: 'users', timestamps: false },
);
