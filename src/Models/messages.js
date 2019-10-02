import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const message = new Schema({
  message: String,
  createdAt: Date,
  room: { type: Schema.Types.ObjectId, ref: 'Room'},
  user: { type: Schema.Types.ObjectId, ref: 'User'},
});

const Message = mongoose.model('Message', message);

export default Message;