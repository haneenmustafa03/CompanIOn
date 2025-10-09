import express from 'express';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Lesson definitions
const LESSONS = {
  alphabet: {
    id: 'alphabet',
    name: 'Alphabet Learning',
    description: 'Learn the alphabet with fun activities',
    skills: ['Reading', 'Letter Recognition', 'Phonics'],
    difficulty: 'Easy',
    duration: 15,
    category: 'Language'
  },
  numbers: {
    id: 'numbers',
    name: 'Number Counting',
    description: 'Master counting from 1 to 20',
    skills: ['Math', 'Counting', 'Number Recognition'],
    difficulty: 'Easy',
    duration: 20,
    category: 'Math'
  },
  colors: {
    id: 'colors',
    name: 'Color Recognition',
    description: 'Learn colors through interactive games',
    skills: ['Visual Learning', 'Color Theory', 'Memory'],
    difficulty: 'Easy',
    duration: 10,
    category: 'Art'
  },
  shapes: {
    id: 'shapes',
    name: 'Shape Learning',
    description: 'Identify and draw basic shapes',
    skills: ['Geometry', 'Visual Recognition', 'Drawing'],
    difficulty: 'Medium',
    duration: 25,
    category: 'Math'
  },
  animals: {
    id: 'animals',
    name: 'Animal Sounds',
    description: 'Learn about different animals and their sounds',
    skills: ['Science', 'Listening', 'Vocabulary'],
    difficulty: 'Easy',
    duration: 18,
    category: 'Science'
  },
  emotions: {
    id: 'emotions',
    name: 'Emotion Recognition',
    description: 'Understand and express different emotions',
    skills: ['Social Skills', 'Emotional Intelligence', 'Communication'],
    difficulty: 'Medium',
    duration: 22,
    category: 'Social'
  }
};

// Get all lessons
router.get('/', (req, res) => {
  res.json({
    success: true,
    lessons: Object.values(LESSONS)
  });
});

// Get specific lesson
router.get('/:lessonId', (req, res) => {
  try {
    const { lessonId } = req.params;
    const lesson = LESSONS[lessonId];
    
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }
    
    res.json({
      success: true,
      lesson
    });
  } catch (error) {
    console.error('Get lesson error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching lesson'
    });
  }
});

// Complete a lesson
router.post('/:lessonId/complete', authenticate, async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { score, timeSpent } = req.body;
    
    if (!LESSONS[lessonId]) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }
    
    // TODO: Save lesson completion to user profile
    // const user = await User.findById(req.userId);
    // user.lessonsCompleted[lessonId] = (user.lessonsCompleted[lessonId] || 0) + 1;
    // await user.save();
    
    res.json({
      success: true,
      message: 'Lesson completed!',
      lessonId,
      score: score || 100,
      timeSpent: timeSpent || LESSONS[lessonId].duration
    });
  } catch (error) {
    console.error('Complete lesson error:', error);
    res.status(500).json({
      success: false,
      message: 'Error recording lesson completion'
    });
  }
});

export default router;
