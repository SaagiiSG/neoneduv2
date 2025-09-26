const mongoose = require('mongoose');

const studyAbroadSchema = new mongoose.Schema({
  programName: {
    type: String,
    required: [true, 'Program name is required'],
    trim: true,
    maxlength: [200, 'Program name cannot exceed 200 characters']
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true,
    maxlength: [100, 'Country cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  link: {
    type: String,
    required: [true, 'Link is required'],
    trim: true,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Link must be a valid URL'
    }
  }
}, {
  timestamps: true
});

// Index for better query performance
studyAbroadSchema.index({ programName: 1 });
studyAbroadSchema.index({ country: 1 });

module.exports = mongoose.model('StudyAbroad', studyAbroadSchema);


