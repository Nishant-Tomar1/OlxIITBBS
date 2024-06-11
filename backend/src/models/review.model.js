import mongoose, {Schema}  from 'mongoose'

const reviewSchema = new Schema({
  reviewer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  comment : {
    type: String,
  }
},{timestamps : true});

module.exports = mongoose.model('Review', reviewSchema);
