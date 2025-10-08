import express from 'express';
import User from '../models/User.js';
import { authenticate, isChild } from '../middleware/auth.js';

const router = express.Router();

//badges
const AVAILABLE_BADGES = [
  {
    id: 'first_chat',
    name: 'First Chat',
    description: 'Sent your first message',
    //icon: 
    requirement: { type: 'chat_count', value: 1 }
  },
  {
    id: 'conversation_starter',
    name: 'Conversation Starter',
    description: 'Had 10 conversations',
    //icon: 
    requirement: { type: 'chat_count', value: 10 }
  },
  {
    id: 'game_master',
    name: 'Game Master',
    description: 'Completed 5 games',
    //icon: 
    requirement: { type: 'games_total', value: 5 }
  },
  {
    id: 'learning_star',
    name: 'Learning Star',
    description: 'Completed all 4 lesson types',
    //icon: 
    requirement: { type: 'all_lessons', value: 4 }
  },
  {
    id: 'week_warrior',
    name: 'Week Warrior',
    description: '7 day streak',
    //icon: 
    requirement: { type: 'streak', value: 7 }
  },
  {
    id: 'month_champion',
    name: 'Month Champion',
    description: '30 day streak',
    //icon:
    requirement: { type: 'streak', value: 30 }
  },
  {
    id: 'helpful_friend',
    name: 'Helpful Friend',
    description: 'Used chat 50 times',
    //icon: 
    requirement: { type: 'chat_count', value: 50 }
  },
  {
    id: 'super_learner',
    name: 'Super Learner',
    description: 'Completed 20 lessons',
    //icon:
    requirement: { type: 'lessons_total', value: 20 }
  }
];

//all available badges
router.get('/available', authenticate, (req, res) => {
  res.json({
    success: true,
    badges: AVAILABLE_BADGES
  });
});

//alr earned badges
router.get('/earned', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    res.json({
      success: true,
      badges: user.badges,
      totalBadges: user.badges.length,
      availableBadges: AVAILABLE_BADGES.length
    });
  } catch (error) {
    console.error('Get earned badges error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching badges'
    });
  }
});

//check and award badges
export async function checkAndAwardBadges(userId) {
  try {
    const user = await User.findById(userId);
    const ChatMessage = (await import('../models/Chat.js')).default;
    
    const chatCount = await ChatMessage.countDocuments({ userId });
    
    const gamesTotal = Object.values(user.gamesCompleted).reduce((a, b) => a + b, 0);
    const lessonsTotal = Object.values(user.lessonsCompleted).reduce((a, b) => a + b, 0);
    
    const uniqueLessons = Object.values(user.lessonsCompleted).filter(count => count > 0).length;
    
    const newBadges = [];
    
    for (const badge of AVAILABLE_BADGES) {
      if (user.badges.some(b => b.badgeId === badge.id)) continue;
      
      let earned = false;
      
      switch (badge.requirement.type) {
        case 'chat_count':
          earned = chatCount >= badge.requirement.value;
          break;
        case 'games_total':
          earned = gamesTotal >= badge.requirement.value;
          break;
        case 'lessons_total':
          earned = lessonsTotal >= badge.requirement.value;
          break;
        case 'all_lessons':
          earned = uniqueLessons >= badge.requirement.value;
          break;
        case 'streak':
          earned = user.streakDays >= badge.requirement.value;
          break;
      }
      
      if (earned) {
        user.badges.push({
          badgeId: badge.id,
          name: badge.name,
          earnedAt: new Date()
        });
        newBadges.push(badge);
      }
    }
    
    if (newBadges.length > 0) {
      await user.save();
    }
    
    return newBadges;
  } catch (error) {
    console.error('Check badges error:', error);
    return [];
  }
}

export default router;