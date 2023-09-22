# To-Do List Backend

This is the backend for a To-Do list SAAS application. Users can create and manage their To-Do lists with various features.

## Features

- User Authentication
- OAuth 2 Login
- Token-Based Authentication
- Task Management
- File Attachments
- Reports
- Similar Tasks
- Password Reset
- Daily Reminders
- Logging
- Security
- API Documentation
- Testing

## Technologies Used

- Node.js
- Express.js
- PostgreSQL or MySQL
- JSON and REST
- OAuth 2
- Token-based Authentication
- Multer
- Nodemailer
- Winston
- Jest

## Getting Started

1. Clone this repository.
2. Install dependencies.
3. Set up the database.
4. Run migrations.
5. Start the server.

## API Endpoints

- POST `/signup`
- POST `/login`
- POST `/login/facebook`
- POST `/password-reset`
- PUT `/password-reset/:resetToken`
- GET `/tasks`
- POST `/tasks`
- GET `/tasks/:taskId`
- PUT `/tasks/:taskId`
- DELETE `/tasks/:taskId`
- POST `/tasks/:taskId/attachments`
- GET `/tasks/:taskId/attachments/:attachmentId`
- GET `/reports/total-task-count`
- GET `/reports/average-tasks-per-day`
- GET `/reports/tasks-not-completed-on-time`
- GET `/reports/max-tasks-completed-in-a-day`
- GET `/reports/tasks-opened-by-day-of-week`
- GET `/similar-tasks`

## Authentication

- User registration requires an email address and password.
- Token-based and OAuth 2 authentication methods are used.

## Reports

- Generate various reports to track task statistics.

## Similar Tasks

- View a list of similar tasks.

## Password Reset

- Request a password reset via email.

## Daily Reminders

- Receive daily email reminders about tasks due today.

## Logging

- All API calls are logged for monitoring and debugging.

