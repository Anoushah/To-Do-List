const express = require('express');
const expressJSDocSwagger = require('express-jsdoc-swagger');
const app = express();

const options = {
  info: {
    version: '1.0.0',
    title: 'To-Do List API',
    description: 'API documentation for the To-Do List application',
  },
  baseDir: __dirname,
  
  filesPattern: '-t-o--b-e--a-d-d-e-d-',
};

expressJSDocSwagger(app)(options);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
