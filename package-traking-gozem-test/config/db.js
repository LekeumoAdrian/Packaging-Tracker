const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/package-tracking', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('The Database Package Tracking is connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;