import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelize from '../config/config';

interface UserAttributes {
  email: string;
  username: string;
  password?: string;
  resetToken?: string;
  isVerified: boolean;
  verificationToken?: string;
}

class User extends Model<UserAttributes> {
  public email!: string;
  public username!: string;
  public password?: string;
  public resetToken?: string;
  public isVerified!: boolean;
  public verificationToken?: string;
  id: any;
}

User.init(
  {
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    verificationToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
  }
);

export default User;
