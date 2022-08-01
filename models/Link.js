const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: 'Прочитати пізніше',
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
    unique: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  owner: {
    type: Types.ObjectId,
    ref: 'User',
  },
});

module.exports = model('Link', schema);
