import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/config';
import User from './user';

interface TaskAttributes {
  taskNumber: number;
  title: string;
  description?: string;
  fileUrl?: string;
  dueDateTime: Date;
  status: string;
  completionDateTime?: Date | null;
  userId: number;
}

class Task extends Model<TaskAttributes> {
  public taskNumber!: number;
  public title!: string;
  public description?: string;
  public fileUrl?: string;
  public dueDateTime!: Date;
  public status!: string;
  public completionDateTime?: Date | null;
  public userId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: { User: typeof User }): void {
    Task.belongsTo(models.User, { foreignKey: 'userId' });
    models.User.hasMany(Task, { foreignKey: 'userId' });
  }
}

Task.init(
  {
    taskNumber: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dueDateTime: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'false',
    },
    completionDateTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Task',
    tableName: 'tasks',
    timestamps: true,
  }
);

Task.addHook('beforeCreate', async (task: Task, _options) => {
  const user = await User.findByPk(task.userId);
  if (user) {
    const tasksCount = await Task.count({ where: { userId: task.userId } });
    task.taskNumber = tasksCount + 1;
  }
});

Task.addHook('beforeUpdate', (task: Task, _options) => {
  if (task.changed('status') && task.status === 'true') {
    task.completionDateTime = new Date();
  }
});

export default Task;
