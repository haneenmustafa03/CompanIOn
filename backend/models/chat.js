
//file for monitoring chat and chat structures
import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  response: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  sentiment: {
    type: String,
    enum: ['positive', 'neutral', 'negative', 'concern'],
    default: 'neutral'
  },
  flagged: {
    type: Boolean,
    default: false
  },
  flagReason: String
}, {
  timestamps: true
});

chatMessageSchema.index({ userId: 1, timestamp: -1 });

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

export default ChatMessage;

/* This file defines how our chat messages are stored... stores each message for now and the response
flags concerning messages, links message to the child user, gives timestamps */