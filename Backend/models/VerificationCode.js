// models/VerificationCode.js
const mongoose = require('mongoose');

const verificationCodeSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  code: {
    type: String,
    required: true
  },
  expires_at: {
    type: Date,
    required: true,
    index: { expires: 0 } 
  },
  used: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('VerificationCode', verificationCodeSchema);