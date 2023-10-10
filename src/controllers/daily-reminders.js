const { Op } = require('sequelize');
const Task = require('../models/task'); 
const User = require('../models/user'); 
const nodemailer = require('nodemailer');

const dbuser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: dbuser,
    pass: dbPassword,
  },
});

async function sendDailyReminders() {
  try {
    const currentDate = new Date();

    const startOfDay = new Date(currentDate);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(currentDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const tasks = await Task.findAll({
      where: {
        dueDateTime: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
      include: User,
    });

    for (const task of tasks) {
      const user = task.User;
      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${user.resetToken}`;
      const mailOptions = {
        from: dbuser,
        to: user.email,
        subject: 'Task Reminder',
        text: `Hi ${user.username},\n\nYou have a task due today: ${task.title}\n\nClick the following link for more details: ${resetLink}`,
      };

      await transporter.sendMail(mailOptions);
    }

    console.log('Daily reminders sent successfully');
  } catch (error) {
    console.error('Error sending daily reminders:', error);
  }
}

// Uncomment the following lines if you want to execute the function immediately
// sendDailyReminders()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error('Error sending daily reminders:', error);
//     process.exit(1);
//   });

module.exports = sendDailyReminders;
