import express from 'express';
import { auth, isAdmin, isHR } from '../middleware/auth.js';
import {
  createQuestion,
  createTest,
  getQuestionsByType,
  getAllQuestions
} from '../controllers/testController.js';

const router = express.Router();

// Create a new question (Admin/HR only)
router.post('/questions', auth, isHR, createQuestion);

// Create a new test (Admin/HR only)
router.post('/tests', auth, isHR, createTest);

// Get questions by type (Admin/HR only)
router.get('/questions/type/:type', auth, isHR, getQuestionsByType);

// Get all questions (Admin/HR only)
router.get('/questions', auth, isHR, getAllQuestions);

export default router; 