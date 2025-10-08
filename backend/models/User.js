import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; //npm install bcrypt

const userSchema = new mongoose.Schema({

    accountType: {
        type: String,
        enum: ['parent', 'child'],
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: true,
    },

    name: {
        type: String,
        required: true,
        trim: true
    },

    //refrring to child
    age: {
        type: Number,
        required: function() { return this.accountType === 'child'; }
    },

    parentEmail: {
        type: String,
        required: function() { return this.accountType === 'child'; }
    },

    children: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    //Settings
    settings: {
        notifications: {
            email: { type: Boolean, default: true },
            push: { type: Boolean, default: true },
            dailySummary: { type: Boolean, default: true }
        },

        /*
        accessibility: {
            
        },
        */
        
        privacy: {
            shareprogress: { type: Boolean, default: true, },
            dataCollection: { type: Boolean, default: true }
        },

        parentalControls: {
            chatFilter: { type: Boolean, default: true },
            timeLimit: { type: Number, default: 60 }, // minutes per day
        }
    },

    badges: [{
    badgeId: String,
    earnedAt: Date,
    name: String
    }],
  
  streakDays: {
    type: Number,
    default: 0
    },
  
  lastActive: {
    type: Date,
    default: Date.now
    },
  
  //game progress
  gamesCompleted: {
    checkers: { type: Number, default: 0 },
    matching: { type: Number, default: 0 },
    storyteller: { type: Number, default: 0 }
    },
  
    // Lesson progress
  lessonsCompleted: {
    speech: { type: Number, default: 0 },
    shoeTying: { type: Number, default: 0 },
    conversation: { type: Number, default: 0 },
    organization: { type: Number, default: 0 }
    }
}, {
    timestamps: true
});

//password hashing
userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

//compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

//method for returning user data w/out their password
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model('User', userSchema);

export default User;