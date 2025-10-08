import jwt from 'jsonwebtoken';
import User from '../models/User.js'

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ 
      success: false, 
      message: 'Invalid or expired token' 
    });
  }
};

//checking if its a parent acct
export const isParent = (req, res, next) => {
  if (req.user.accountType !== 'parent') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Parent account required.'
    });
  }
  next();
};

//child acct
export const isChild = (req, res, next) => {
  if (req.user.accountType !== 'child') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Child account required.'
    });
  }
  next();
};