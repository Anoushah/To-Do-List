const express = require('express');
const app = express();
const session = require('express-session');
app.use(express.json()); // Note to self: ALWAYS PUT BEFORE ROUTES OR ELSE IT'LL CRASH & GIVE HEART ATTACK 🤯
const sequelize = require('./config');
const signupRoute = require('./signup');
const loginRoute = require('./login');
const googleAuthRoute = require('./google_Auth/googleAuth');
const tasksRoute = require('./tasks');
const passport = require('passport');
const commonRoutes = require('./routes/tasksRoute'); 
const countTasks = require('./reports/countTasks');
const avgTasks = require('./reports/averageTasks');
const maxTasks = require('./reports/maxTasks');
const openedTasks = require('./reports/openedTasks');
const overdueTasks = require('./reports/overdueTasks');
const similarTasks = require('./algorithms/similarTasks');
const resetPass = require('./passwordReset');
app.use('/reports', countTasks);
app.use('/reports', avgTasks);
app.use('/reports', maxTasks);
app.use('/reports', openedTasks);
app.use('/reports', overdueTasks);
app.use('/algorithms', similarTasks);
//app.use('/', resetPass);
app.use('/', commonRoutes);

require('dotenv').config();
app.use(session({
  secret: 'thekeyisverysecret',
  resave: false,
  saveUninitialized: true,
}));

app.use(signupRoute);
app.use(loginRoute);
app.use(googleAuthRoute);
app.use(tasksRoute);

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use('/uploads', express.static('uploads'));

app.use(passport.initialize());
require('./google_Auth/passport-config');

sequelize.sync().then(() => {
  console.log('Database connected');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/front-end/login.html');
});

const port = 1250;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

