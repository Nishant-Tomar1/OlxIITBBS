import mongoose, { Schema } from 'mongoose';

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  monthsUsed : {
    type : Number,
    required : true
  },
  images: [
    {
      type: String, //cloudinary urls
    },
  ],
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['active', 'sold'],
    default: 'active',
  }
},{timestamps : true});

export default model('Product', productSchema);
