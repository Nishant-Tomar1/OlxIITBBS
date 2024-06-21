import mongoose, { Schema }  from 'mongoose'

const wishSchema = new Schema({
  wishedBy : {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required : true
  },
},{timestamps : true});

export const Wish = mongoose.model('Wish', wishSchema);
