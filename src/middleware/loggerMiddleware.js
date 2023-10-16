const logger = require('../../logger');

function logRequestResponse(req, res, next) {
  const { method, originalUrl, body } = req;

  logger.info(`[${method}] ${originalUrl}`);
  logger.info(`Request Body: ${JSON.stringify(body)}`);

  const send = res.send;
  res.send = function (body) {
    logger.info(`Response Body: ${JSON.stringify(body)}`);
    send.apply(res, arguments);
  };

  next();
}

module.exports = logRequestResponse;