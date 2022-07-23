const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'User',
  },
  links: [{
    type: Types.ObjectId,
    ref: 'Link',
  }]
});

module.exports = model('User', schema);
