import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/config';

export interface UserAttributes {
  email: string;
  username: string;
  uuid: string;
  password: string | null;
  resetToken: string | null;
  isVerified: string; 
  verificationToken: string | null;
}

class User extends Model<UserAttributes> {
  public email!: string;
  public username!: string;
  public password?: string;
  public resetToken?: string;
  public isVerified: string | undefined; 
  public verificationToken?: string | null;
  public uuid!: string; 
  public id!: any;
  public createdAt!: Date;
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
      type: DataTypes.STRING,
      defaultValue: false,
    },
    verificationToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    uuid: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
  }
);

export default User;
