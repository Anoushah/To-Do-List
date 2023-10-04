const express = require('express');
const app = express();
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const session = require('express-session');
const passport = require('passport');
const sequelize = require('./src/config/config');
const routes = require('./src/routes');
const logRequestResponse = require('./src/middleware/loggerMiddleware'); 
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(logRequestResponse);

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

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0', 
    info: {
      title: 'To-Do List API',
      version: '1.0.0',
      description: 'API documentation for the To-Do List application.',
    },
    servers: [
      {
        url: 'http://localhost:1250', 
        description: 'Server',
      },
    ],
  },
  apis: ['./src/controllers/authController.js', './src/controllers/reportController.js', './src/controllers/taskController.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/reports', routes.reportRoutes);
app.use('/', routes.taskRoutes);
app.use('/', routes.resetPass);
app.use('/', routes.authRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

const port = process.env.PORT || 1250;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;