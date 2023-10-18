import express, { Express, Request, Response } from 'express';
import cron from 'node-cron';
import sendDailyReminders from './src/controllers/daily-reminders';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import session from 'express-session';
import passport from 'passport';
import sequelize from './src/config/config';
import routes from './src/routes';
import logRequestResponse from './src/middleware/loggerMiddleware';
import errorHandler from './errorHandler';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(logRequestResponse);

app.use(
  session({
    secret: 'thekeyisverysecret',
    resave: false,
    saveUninitialized: true,
  })
);

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
  apis: ['./swagger.yaml'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

cron.schedule('0 0 * * *', () => {
  sendDailyReminders()
    .then(() => {
      console.log('Scheduled daily reminders executed successfully');
    })
    .catch((error: Error) => {
      console.error('Error executing scheduled daily reminders:', error);
    });
});

app.use('/reports', routes.reportRoutes);
app.use('/', routes.taskRoutes);
app.use('/', routes.resetPass);
app.use('/', routes.authRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/login', (req: Request, res: Response) => {
  res.sendFile(__dirname + '/login.html');
});

app.use(errorHandler);

const port: number = Number(process.env.PORT) || 1250;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
