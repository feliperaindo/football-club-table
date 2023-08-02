// Libraries
import { Model, DataTypes, QueryInterface } from 'sequelize';

// Types
import { UserMigration } from '../../types/migrations/exporter';

export default {
  up: (queryInterface: QueryInterface) =>
    queryInterface.createTable<Model<UserMigration>>('users', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      role: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      username: { type: DataTypes.STRING, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
    }),
  down: (queryInterface: QueryInterface) => queryInterface.dropTable('users'),
};
