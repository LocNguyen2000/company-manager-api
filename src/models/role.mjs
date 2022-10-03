import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.mjs';
export const RoleFunc = sequelize => sequelize.define(
  'Role',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    role: {
      type: DataTypes.ENUM,
      values: ['President', 'Manager', 'Leader', 'Staff', 'Customer'],
      allowNull: false,
      unique: true,
      validate: {
        len: [2, 50],
      },
    },
    createdBy: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    updatedBy: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
  },
  {
    tableName: 'role',
  }
);


// const Role = RoleFunc(sequelize)
// export default Role;
