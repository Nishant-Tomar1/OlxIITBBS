import mongoose, {Schema}  from 'mongoose'

const ratingSchema = new Schema({
  evaluator : {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
  },
  value : {
    type: Number,
    min : 1,
    max : 5
  }
},{timestamps : true});

export const Rating = mongoose.model('Rating', ratingSchema);
