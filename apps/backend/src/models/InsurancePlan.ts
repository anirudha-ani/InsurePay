import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface InsurancePlanAttributes {
  id: number;
  premium: number;
  taxFee: number;
}

interface InsurancePlanCreationAttributes extends Optional<InsurancePlanAttributes, 'id'> {}

class InsurancePlan extends Model<InsurancePlanAttributes, InsurancePlanCreationAttributes> implements InsurancePlanAttributes {
  public id!: number;
  public premium!: number;
  public taxFee!: number;
}

InsurancePlan.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    premium: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    taxFee: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
  },
  {
    sequelize,
    tableName: 'insurance_plans',
  }
);

export default InsurancePlan;