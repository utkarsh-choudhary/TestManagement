const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['mcq', 'theory', 'coding'],
    required: true
  },
  questionText: {
    type: String,
    required: true
  },
  options: {
    type: [String], // Only for MCQ
    default: undefined
  },
  correctAnswer: {
    type: String // For MCQ/coding/theory, can be used flexibly
  },
  candidateAnswer: {
    type: String // What the candidate submitted
  },
  scoreAwarded: {
    type: Number,
    default: 0
  },
  maxScore: {
    type: Number,
    default: 0
  },
  feedback: {
    type: String,
    default: ''
  }
});

const TestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    default: null
  },
  position: {
    type: String,
    default: 'Technical Role'
  },
  testCompleted: {
    type: Boolean,
    default: false
  },
  shortlisted: {
    type: Boolean,
    default: false
  },
  totalScore: {
    type: Number,
    default: 0
  },
  maxScore: {
    type: Number,
    default: 0
  },
  feedback: {
    type: String,
    default: ''
  },
  resumeUrl: {
    type: String,
    default: ''
  },
  interviewDate: {
    type: Date,
    default: null
  },
  questions: [QuestionSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('TechnicalTest', TestSchema);
