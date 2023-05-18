require('dotenv').config();
const app = require('./app')
const PORT = process.env.PORT || 3000;

const mongoose = require('mongoose');
const {getCurrentHost} = require('./helperFunctions/getCurrentHost');
mongoose.Promise = global.Promise;

const connection = mongoose.connect(process.env.DB_URI);


connection
  .then(() => {
    app.listen(PORT, function () {
      const HOST=getCurrentHost();
      console.log(`app running on ${HOST}`);
    });
  })
  .catch(err =>
    console.log(`Server not running. Error message: ${err.message}`),
  );