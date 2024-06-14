const mongoose = require('mongoose');

const reviewsSchema = new mongoose.Schema({
    author: {
      type: String,
      required: true,
    },
    whatType: {
      type: String,
      required: true,
    },
    ghostReview: {
      type: String,
      required: true,
    },
    rating: {
      type: String,
      required: true,
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
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  reviews: [reviewsSchema],
})

const Ghost = mongoose.model('Ghost', hauntSchema);

module.exports = Ghost