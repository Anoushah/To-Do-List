const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const sequelize = require('./src/config/config');
const routes = require('./src/routes');
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
require('./src/google_Auth/passport-config');

sequelize.sync().then(() => {
  console.log('Database connected');
});

app.use('/reports', routes.reportRoutes);
app.use('/', routes.taskRoutes);
app.use('/', routes.resetPass);
app.use('/', routes.authRoutes);

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

const port = process.env.PORT || 1250;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});