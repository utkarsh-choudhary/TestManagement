import Test from '../models/Test.js';

// Create a new question
export const createQuestion = async (req, res) => {
  try {
    const { type, questionText, options, correctAnswer, maxScore } = req.body;

    // Validate question type
    if (!['mcq', 'theory', 'coding'].includes(type)) {
      return res.status(400).json({ message: 'Invalid question type' });
    }

    // Validate required fields
    if (!questionText || !correctAnswer || !maxScore) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate options for MCQ type
    if (type === 'mcq' && (!options || !Array.isArray(options) || options.length < 2)) {
      return res.status(400).json({ message: 'MCQ questions must have at least 2 options' });
    }

    const question = {
      type,
      questionText,
      options: type === 'mcq' ? options : undefined,
      correctAnswer,
      maxScore
    };

    res.status(201).json({ message: 'Question created successfully', question });
  } catch (error) {
    res.status(500).json({ message: 'Error creating question', error: error.message });
  }
};

// Create a new test
export const createTest = async (req, res) => {
  try {
    const { name, email, phone, position, questions } = req.body;

    // Validate required fields
    if (!name || !email || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Calculate total max score
    const maxScore = questions.reduce((total, q) => total + (q.maxScore || 0), 0);

    const test = new Test({
      name,
      email,
      phone,
      position,
      questions,
      maxScore
    });

    await test.save();

    res.status(201).json({ message: 'Test created successfully', test });
  } catch (error) {
    res.status(500).json({ message: 'Error creating test', error: error.message });
  }
};

// Get questions by type
export const getQuestionsByType = async (req, res) => {
  try {
    const { type } = req.params;

    // Validate question type
    if (!['mcq', 'theory', 'coding'].includes(type)) {
      return res.status(400).json({ message: 'Invalid question type' });
    }

    const tests = await Test.find({ 'questions.type': type });
    const questions = tests.flatMap(test => 
      test.questions.filter(q => q.type === type)
    );

    res.status(200).json({ questions });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching questions', error: error.message });
  }
};

// Get all questions
export const getAllQuestions = async (req, res) => {
  try {
    const tests = await Test.find({});
    const questions = tests.flatMap(test => test.questions);

    res.status(200).json({ questions });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching questions', error: error.message });
  }
};
