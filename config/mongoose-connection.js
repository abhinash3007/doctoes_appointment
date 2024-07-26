const mongoose = require('mongoose');
const debug = require('debug')('development:mongoose');

mongoose
  .connect(`${process.env.MONGODB_URI}/hospital_management`, {
    // No need for `useNewUrlParser` and `useUnifiedTopology` options
  })
  .then(() => {
    debug('Connected to MongoDB');
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    debug('MongoDB connection error:', err);
  });
