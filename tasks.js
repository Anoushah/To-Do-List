const express = require('express');
const router = express.Router();
const multer = require('multer');
const commonRoutes = require('./routes/tasksRoute');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); 
  },
});
const upload = multer({ storage: storage });
router.use('/', commonRoutes);
module.exports = router;
