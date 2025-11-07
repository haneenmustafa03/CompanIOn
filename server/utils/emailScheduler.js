import cron from 'node-cron';
import nodemailer from 'nodemailer';
import User from '../models/User.js';
import ChatMessage from '../models/Chat.js';

//configures email transpotrter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

//gerates email html
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
          This is an automated daily summary. If you have concerns, please review with your child or consult their therapist.
        </p>
      </div>
    </body>
    </html>
  `;
}

//daily summarries sending
async function sendDailySummaries() {
  try {
    console.log('Starting daily email summary job...');
    
    
    const parents = await User.find({
      accountType: 'parent',
      'settings.notifications.email': true,
      'settings.notifications.dailySummary': true
    }).populate('children');
    
    console.log(`Found ${parents.length} parents with email notifications enabled`);
    
    //date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    
    const endOfYesterday = new Date(yesterday);
    endOfYesterday.setHours(23, 59, 59, 999);
    
    let emailsSent = 0;
    
    for (const parent of parents) {
      for (const child of parent.children) {
        const messages = await ChatMessage.find({
          userId: child._id,
          timestamp: {
            $gte: yesterday,
            $lte: endOfYesterday
          }
        }).sort({ timestamp: 1 });
        
        //onl send email if there were messages
        if (messages.length > 0) {
          const emailHTML = generateDailySummaryEmail(child, messages, yesterday);
          
          try {
            await transporter.sendMail({
              from: process.env.EMAIL_USER,
              to: parent.email,
              subject: `Daily Summary for ${child.name} - ${yesterday.toLocaleDateString()}`,
              html: emailHTML
            });
            
            emailsSent++;
            console.log(`Sent daily summary to ${parent.email} for child ${child.name}`);
          } catch (emailError) {
            console.error(`Failed to send email to ${parent.email}:`, emailError);
          }
        }
      }
    }
    
    console.log(`Daily summary job completed. Sent ${emailsSent} emails.`);
  } catch (error) {
    console.error('Error in daily summary job:', error);
  }
}


export function startEmailScheduler() {
  console.log('Email scheduler initialized. Daily summaries will be sent at 8:00 AM');
  
  cron.schedule('0 8 * * *', () => {
    console.log('Running scheduled daily summary job...');
    sendDailySummaries();
  }, {
    timezone: "America/New_York"
  });
  
  
}

export { sendDailySummaries };