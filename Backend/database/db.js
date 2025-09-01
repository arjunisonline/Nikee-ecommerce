const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://admin:admin123@cluster0.mmnvy.mongodb.net/footwear');

const db= mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = db;