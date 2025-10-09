import express from 'express';
import { authenticate, isChild } from '../middleware/auth.js';
import User from '../models/User.js';
import { checkAndAwardBadges } from './badges.js';

const router = express.Router();

//game defs
const GAMES = {
  checkers: {
    id: 'checkers',
    name: 'Checkers',
    description: 'Play checkers and practice thinking ahead',
    skills: ['Strategy', 'Planning', 'Turn-taking'],
    difficulty: 'Medium'
  },
  matching: {
    id: 'matching',
    name: 'Matching Game',
    description: 'Match pairs of cards to practice memory',
    skills: ['Memory', 'Concentration', 'Pattern recognition'],
    difficulty: 'Easy'
  },
  storyteller: {
    id: 'storyteller',
    name: 'Story Teller',
    description: 'Create stories and practice creativity',
    skills: ['Creativity', 'Language', 'Sequencing'],
    difficulty: 'Easy'
  }
};

router.get('/', (req, res) => {
  res.json({
    success: true,
    games: Object.values(GAMES)
  });
});

router.get('/:gameId', authenticate, async (req, res) => {
  try {
    const { gameId } = req.params;
    const game = GAMES[gameId];
    
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }
    
    const user = await User.findById(req.userId);
    const timesPlayed = user.gamesCompleted[gameId] || 0;
    
    res.json({
      success: true,
      game,
      userStats: {
        timesPlayed,
        lastPlayed: user.lastActive
      }
    });
  } catch (error) {
    console.error('Get game error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching game'
    });
  }
});

router.post('/:gameId/complete', authenticate, isChild, async (req, res) => {
  try {
    const { gameId } = req.params;
    const { score, duration } = req.body;
    
    if (!GAMES[gameId]) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }
    
    const user = await User.findById(req.userId);
    
    if (!user.gamesCompleted[gameId]) {
      user.gamesCompleted[gameId] = 0;
    }
    user.gamesCompleted[gameId]++;
    
    user.lastActive = new Date();
    
    await user.save();
    
    const newBadges = await checkAndAwardBadges(req.userId);
    
    res.json({
      success: true,
      message: 'Game completed!',
      gamesCompleted: user.gamesCompleted[gameId],
      newBadges: newBadges
    });
  } catch (error) {
    console.error('Complete game error:', error);
    res.status(500).json({
      success: false,
      message: 'Error recording game completion'
    });
  }
});

router.get('/stats/all', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    const gameStats = Object.keys(GAMES).map(gameId => ({
      gameId,
      name: GAMES[gameId].name,
      timesPlayed: user.gamesCompleted[gameId] || 0
    }));
    
    const totalGames = Object.values(user.gamesCompleted).reduce((a, b) => a + b, 0);
    
    res.json({
      success: true,
      stats: gameStats,
      totalGamesPlayed: totalGames,
      favoriteGame: Object.keys(user.gamesCompleted).reduce((a, b) => 
        user.gamesCompleted[a] > user.gamesCompleted[b] ? a : b
      , 'checkers')
    });
  } catch (error) {
    console.error('Get game stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching game statistics'
    });
  }
});

export default router;

/* lists all games in /GET, gets specific games and stats, records when the game is finished, returns overall game stats will also award a badge if milestone is acheived*/