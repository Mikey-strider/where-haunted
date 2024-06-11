const mongoose = require('mongoose');

const reviewsSchema = new mongoose.Schema({
  reviews: {
    whatType: {
      type: String,
      required: true,
    },
    ghostDescription: {
      type: String,
      required: true,
    },
    rating: {
      type: String,
      required: true,
    },
  },
})


const hauntSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  user: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserModel',
  }],
  reviews: [reviewsSchema],
})

const Ghost = mongoose.model('Ghost', hauntSchema);

module.exports = Ghost