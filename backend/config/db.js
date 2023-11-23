const mongoose = require('mongoose');

const connectDB = (url) => {
  mongoose.set('strictQuery', true);
  mongoose
    .connect(url)
    .then(() => console.log('Mongodb connected...'))
    .catch((err) => console.error(err));
};
module.exports = connectDB;
