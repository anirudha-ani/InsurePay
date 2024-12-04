import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import User from './User';

interface FinanceTermsAttributes {
  id: number;
  dueDate: Date;
  createdBy: number;
  agreedBy?: number;
  status: 'agreed' | 'non-agreed';
  insurancePolicyIDs: number[];
}

interface FinanceTermsCreationAttributes extends Optional<FinanceTermsAttributes, 'id' | 'agreedBy'> {}

class FinanceTerms extends Model<FinanceTermsAttributes, FinanceTermsCreationAttributes> implements FinanceTermsAttributes {
  public id!: number;
  public dueDate!: Date;
  public createdBy!: number;
  public agreedBy?: number;
  public status!: 'agreed' | 'non-agreed';
  public insurancePolicyIDs!: number[];
}

FinanceTerms.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    agreedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM('agreed', 'non-agreed'),
      allowNull: false,
      defaultValue: 'non-agreed',
    },
    insurancePolicyIDs: {
      // This is problemetic cause JSONB does not work for postgres and ARRAY does not work for sqlite - need to fix this
      type: process.env.DB_DIALECT === 'sqlite' ? DataTypes.JSONB : DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'finance_terms',
  }
);

// Define associations
FinanceTerms.belongsTo(User, { as: 'creator', foreignKey: 'createdBy' });
FinanceTerms.belongsTo(User, { as: 'agreer', foreignKey: 'agreedBy' });

export default FinanceTerms;