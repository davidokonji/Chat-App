import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const user = new Schema({
  username: String,
  room: { type: Schema.Types.ObjectId, ref: 'Room'},
});

const User = mongoose.model('User', user);

export default User;