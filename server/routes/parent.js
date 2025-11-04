import express from 'express';
import nodemailer from 'nodemailer';
import User from '../models/User.js';
import ChatMessage from '../models/Chat.js';
import { authenticate, isParent } from '../middleware/auth.js';

const router = express.Router();

// Configure email transporter (using Gmail as example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD // Use App Password for Gmail
  }
});

// Get all children for parent
router.get('/children', authenticate, isParent, async (req, res) => {
  try {
    const parent = await User.findById(req.userId).populate('children', '-password');
    
    res.json({
      success: true,
      children: parent.children
    });
  } catch (error) {
    console.error('Get children error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching children'
    });
  }
});

// Get child's progress
router.get('/child/:childId/progress', authenticate, isParent, async (req, res) => {
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
      progress: {
        badges: child.badges,
        streakDays: child.streakDays,
        gamesCompleted: child.gamesCompleted,
        lessonsCompleted: child.lessonsCompleted,
        lastActive: child.lastActive
      }
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching progress'
    });
  }
});

// Send daily email summary manually
router.post('/send-daily-summary/:childId', authenticate, isParent, async (req, res) => {
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
    
    // Get yesterday's messages
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    
    const endOfYesterday = new Date(yesterday);
    endOfYesterday.setHours(23, 59, 59, 999);
    
    const messages = await ChatMessage.find({
      userId: childId,
      timestamp: {
        $gte: yesterday,
        $lte: endOfYesterday
      }
    }).sort({ timestamp: 1 });
    
    if (messages.length === 0) {
      return res.json({
        success: true,
        message: 'No messages to report for yesterday'
      });
    }
    
    // Generate email HTML
    const emailHTML = generateDailySummaryEmail(child, messages, yesterday);
    
    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: req.user.email,
      subject: `Daily Summary for ${child.name} - ${yesterday.toLocaleDateString()}`,
      html: emailHTML
    });
    
    res.json({
      success: true,
      message: 'Daily summary sent successfully'
    });
  } catch (error) {
    console.error('Send daily summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending daily summary',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Helper function to generate email HTML
function generateDailySummaryEmail(child, messages, date) {
  const flaggedMessages = messages.filter(m => m.flagged);
  const sentimentCounts = {
    positive: messages.filter(m => m.sentiment === 'positive').length,
    neutral: messages.filter(m => m.sentiment === 'neutral').length,
    negative: messages.filter(m => m.sentiment === 'negative').length,
    concern: messages.filter(m => m.sentiment === 'concern').length
  };
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4CAF50; color: white; padding: 20px; border-radius: 5px; }
        .summary-box { background: #f5f5f5; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .stat { display: inline-block; margin: 10px 20px 10px 0; }
        .flagged { background: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin: 10px 0; }
        .concern { background: #f8d7da; border-left: 4px solid #dc3545; padding: 10px; margin: 10px 0; }
        .message { background: white; padding: 10px; margin: 10px 0; border-left: 3px solid #2196F3; }
        .timestamp { color: #666; font-size: 0.9em; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Daily Summary for ${child.name}</h2>
          <p>${date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        
        <div class="summary-box">
          <h3>Activity Summary</h3>
          <div class="stat"><strong>Total Messages:</strong> ${messages.length}</div>
          <div class="stat"><strong>Positive:</strong> ${sentimentCounts.positive}</div>
          <div class="stat"><strong>Neutral:</strong> ${sentimentCounts.neutral}</div>
          ${sentimentCounts.negative > 0 ? `<div class="stat"><strong>Negative:</strong> ${sentimentCounts.negative}</div>` : ''}
          ${sentimentCounts.concern > 0 ? `<div class="stat" style="color: #dc3545;"><strong>⚠️ Concerns:</strong> ${sentimentCounts.concern}</div>` : ''}
        </div>
        
        ${flaggedMessages.length > 0 ? `
          <div class="concern">
            <h3>⚠️ Flagged Messages (${flaggedMessages.length})</h3>
            <p>These messages contained keywords that may need attention:</p>
            ${flaggedMessages.map(msg => `
              <div class="message">
                <p class="timestamp">${new Date(msg.timestamp).toLocaleTimeString()}</p>
                <p><strong>Child:</strong> ${msg.message}</p>
                <p><strong>Response:</strong> ${msg.response}</p>
                ${msg.flagReason ? `<p style="color: #dc3545;"><em>Reason: ${msg.flagReason}</em></p>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}
        
        <div class="summary-box">
          <h3>Recent Conversations</h3>
          ${messages.slice(-5).map(msg => `
            <div class="message">
              <p class="timestamp">${new Date(msg.timestamp).toLocaleTimeString()}</p>
              <p><strong>Child:</strong> ${msg.message}</p>
              <p><strong>Assistant:</strong> ${msg.response}</p>
            </div>
          `).join('')}
        </div>
        
        <div class="summary-box">
          <h3>Progress Update</h3>
          <p><strong>Current Streak:</strong> ${child.streakDays} days</p>
          <p><strong>Total Badges:</strong> ${child.badges.length} / 8</p>
        </div>
        
        <p style="color: #666; font-size: 0.9em; margin-top: 30px;">
          This is an automated daily summary from your child's Autism Support App. 
          If you have concerns about any flagged messages, please review them with your child or consult with their therapist.
        </p>
      </div>
    </body>
    </html>
  `;
}

export default router;