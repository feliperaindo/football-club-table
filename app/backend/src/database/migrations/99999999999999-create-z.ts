// libraries
import { Model, QueryInterface, DataTypes } from 'sequelize';

// interfaces
import IExample from '../../interfaces/example';

export default {
  up(queryInterface: QueryInterface) {
    return queryInterface.createTable<Model<IExample>>('trybe_eval', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
    });
  },
  down(queryInterface: QueryInterface) {
    return queryInterface.dropTable('trybe_eval');
  },
};
