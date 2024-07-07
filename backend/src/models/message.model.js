import mongoose, {Schema} from 'mongoose'

const messageSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timeStamp: { 
    type: Date, 
    default: Date.now() 
  }
});

export const Message = mongoose.model('Message', messageSchema);
