// Libraries
import { Model, DataTypes, QueryInterface } from 'sequelize';

// Types
import { migrations } from '../../types/exporter';

export default {
  up: (queryInterface: QueryInterface) =>
    queryInterface.createTable<Model<migrations.TeamsMigration>>('teams', {
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
