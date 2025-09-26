const mongoose = require('mongoose');

const socialSchema = new mongoose.Schema({
  platform: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Social media URL must be a valid URL'
    }
  }
}, { _id: false });

const contactInfoSchema = new mongoose.Schema({
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
    maxlength: [500, 'Address cannot exceed 500 characters']
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    trim: true,
    maxlength: [20, 'Phone cannot exceed 20 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Email must be a valid email address'
    }
  },
  socials: [socialSchema]
}, {
  timestamps: true
});

// Ensure only one contact info document exists
contactInfoSchema.index({}, { unique: true });

module.exports = mongoose.model('ContactInfo', contactInfoSchema);


