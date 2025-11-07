import express from 'express';
import User from '../models/User.js';
import { authenticate, isParent } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    res.json({
      success: true,
      settings: user.settings
    });
  } catch (error) {
    console.error('Update parental controls error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating parental controls'
    });
  }
});

//child settings for parents to view
router.get('/child/:childId', authenticate, isParent, async (req, res) => {
  try {
    const { childId } = req.params;
    
    const hasAccess = req.user.children.some(
      child => child.toString() === childId
    );
    
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    const child = await User.findById(childId);
    
    if (!child) {
      return res.status(404).json({
        success: false,
        message: 'Child not found'
      });
    }
    
    res.json({
      success: true,
      settings: child.settings
    });
  } catch (error) {
    console.error('Get child settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching child settings'
    });
  }
});


//update notif settings
router.patch('/notifications', authenticate, async (req, res) => {
  try {
    const { email, push, dailySummary } = req.body;
    
    const user = await User.findById(req.userId);
    
    if (email !== undefined) user.settings.notifications.email = email;
    if (push !== undefined) user.settings.notifications.push = push;
    if (dailySummary !== undefined) user.settings.notifications.dailySummary = dailySummary;
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Notification settings updated',
      settings: user.settings
    });
  } catch (error) {
    console.error('Update notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating notification settings'
    });
  }
});

//accessibility settings 
router.patch('/accessibility', authenticate, async (req, res) => {
  try {
    const { textSize, highContrast, voiceAssist, simplifiedUI } = req.body;
    
    const user = await User.findById(req.userId);
    
    if (textSize) user.settings.accessibility.textSize = textSize;
    if (highContrast !== undefined) user.settings.accessibility.highContrast = highContrast;
    if (voiceAssist !== undefined) user.settings.accessibility.voiceAssist = voiceAssist;
    if (simplifiedUI !== undefined) user.settings.accessibility.simplifiedUI = simplifiedUI;
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Accessibility settings updated',
      settings: user.settings
    });
  } catch (error) {
    console.error('Update accessibility error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating accessibility settings'
    });
  }
});

//privacy settings
router.patch('/privacy', authenticate, async (req, res) => {
  try {
    const { shareProgress, dataCollection } = req.body;
    
    const user = await User.findById(req.userId);
    
    if (shareProgress !== undefined) user.settings.privacy.shareProgress = shareProgress;
    if (dataCollection !== undefined) user.settings.privacy.dataCollection = dataCollection;
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Privacy settings updated',
      settings: user.settings
    });
  } catch (error) {
    console.error('Update privacy error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating privacy settings'
    });
  }
});

//parental controls parentonly 
router.patch('/parental-controls/:childId', authenticate, isParent, async (req, res) => {
  try {
    const { childId } = req.params;
    const { chatFilter, timeLimit, allowedGames, allowedLessons } = req.body;
    
    //does parent have access to this child
    const hasAccess = req.user.children.some(
      child => child.toString() === childId
    );
    
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    const child = await User.findById(childId);
    
    if (!child) {
      return res.status(404).json({
        success: false,
        message: 'Child not found'
      });
    }
    
    if (chatFilter !== undefined) child.settings.parentalControls.chatFilter = chatFilter;
    if (timeLimit !== undefined) child.settings.parentalControls.timeLimit = timeLimit;
    if (allowedGames) child.settings.parentalControls.allowedGames = allowedGames;
    if (allowedLessons) child.settings.parentalControls.allowedLessons = allowedLessons;
    
    await child.save();
    
    res.json({
      success: true,
      message: 'Parental controls updated',
      settings: child.settings.parentalControls
    });
  } catch (error) {
    console.error('Update parental controls error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating parental controls'
    });
  }
});

//might simplify settings, this is just standard structure for what I saw in other apps