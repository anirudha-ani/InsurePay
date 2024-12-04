import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import InsurancePlan from './InsurancePlan';
import User from './User';

interface InsurancePolicyAttributes {
  id: number;
  userId: number;
  insurancePlanId: number;
}

interface InsurancePolicyCreationAttributes extends Optional<InsurancePolicyAttributes, 'id'> {}

class InsurancePolicy extends Model<InsurancePolicyAttributes, InsurancePolicyCreationAttributes> implements InsurancePolicyAttributes {
  public id!: number;
  public userId!: number;
  public insurancePlanId!: number;
}

InsurancePolicy.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    insurancePlanId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: InsurancePlan,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'insurance_policies',
  }
);

// Define associations
InsurancePolicy.belongsTo(User, { foreignKey: 'userId' });
InsurancePolicy.belongsTo(InsurancePlan, { foreignKey: 'insurancePlanId' });
User.hasMany(InsurancePolicy, { foreignKey: 'userId' });
InsurancePlan.hasMany(InsurancePolicy, { foreignKey: 'insurancePlanId' });

export default InsurancePolicy;