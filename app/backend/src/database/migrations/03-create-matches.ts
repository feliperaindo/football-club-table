// Libraries
import { Model, DataTypes, QueryInterface } from 'sequelize';

// Types
import { MatchesMigration } from '../../types/migrations/exporter';

export default {
  up: (queryInterface: QueryInterface) =>
    queryInterface.createTable<Model<MatchesMigration>>('matches', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      homeTeamId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'home_team_id',
        references: { model: 'teams' },
      },
      homeTeamGoals: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'home_team_goals',
      },
      awayTeamId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'away_team_id',
        references: { model: 'teams' },
      },
      awayTeamGoals: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'away_team_goals',
      },
      inProgress: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: 'in_progress',
      },
    }),
  down: (queryInterface: QueryInterface) => queryInterface.dropTable('matches'),
};
