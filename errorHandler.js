
function errorHandler(err, req, res, next) {
    console.error(err);
  
    if (res.headersSent) {
      return next(err);
    }
  
    if (err instanceof CustomErrorType) {
      return res.status(400).json({ error: err.message });
    }
  
    res.status(500).json({ error: 'Internal server error' });
  }
  
module.exports = errorHandler;
  