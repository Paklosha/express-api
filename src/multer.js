const multer = require('multer')
const path = require('path')

let storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname + '/uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
  }
});

let upload = multer({ storage: storage });

module.exports = upload