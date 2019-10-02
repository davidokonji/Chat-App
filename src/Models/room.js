import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const room = new Schema({
  name: String,
});

const Room = mongoose.model('Room', room);

export default Room;