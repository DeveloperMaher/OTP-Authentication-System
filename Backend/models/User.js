// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to validate password
userSchema.methods.validatePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Relationship to verification codes (virtual)
userSchema.virtual('verificationCodes', {
  ref: 'VerificationCode',
  localField: '_id',
  foreignField: 'user_id'
});

module.exports = mongoose.model('User', userSchema);