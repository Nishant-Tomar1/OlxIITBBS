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
  comment : {
    type: String,
  }
},{timestamps : true});

export const Review = mongoose.model('Review', reviewSchema);
