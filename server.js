require('dotenv').config();
const app = require('./app')
const PORT = process.env.PORT || 3000;

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const connection = mongoose.connect(process.env.DB_URI);


connection
  .then(() => {
    app.listen(PORT, function () {
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  })
  .catch(err =>
    console.log(`Server not running. Error message: ${err.message}`),
  );