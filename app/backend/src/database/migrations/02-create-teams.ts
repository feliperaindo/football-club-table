// Libraries
import { Model, DataTypes, QueryInterface } from 'sequelize';

// Types
import { TeamsMigration } from '../../types/migrations/exporter';

export default {
  up: (queryInterface: QueryInterface) =>
    queryInterface.createTable<Model<TeamsMigration>>('teams', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      teamName: { type: DataTypes.STRING, allowNull: false, field: 'team_name' },
    }),
  down: (queryInterface: QueryInterface) => queryInterface.dropTable('teams'),
};
