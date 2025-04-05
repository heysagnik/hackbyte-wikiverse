import mongoose, { Schema } from 'mongoose';

// Task Progress Schema
const TaskProgressSchema = new Schema({
  taskId: String,
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: Date
});

// Quest Progress Schema
const QuestProgressSchema = new Schema({
  questId: {
    type: Schema.Types.ObjectId,
    ref: 'Quest'
  },
  completed: {
    type: Boolean,
    default: false
  },
  score: Number,
  earnedXP: Number,
  completedAt: Date,
  tasks: [TaskProgressSchema]
});

// User Progress Schema
const UserProgressSchema = new Schema({
  currentLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  quests: [QuestProgressSchema]
});

// User Settings Schema
const UserSettingsSchema = new Schema({
  darkMode: { 
    type: Boolean, 
    default: false 
  },
  highContrast: { 
    type: Boolean, 
    default: false 
  },
  shareProgress: { 
    type: Boolean, 
    default: true 
  },
  language: { 
    type: String, 
    default: 'en' 
  }
});

// User Schema
const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  displayName: { type: String },
  image: String,
  totalXP: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  progress: {
    type: UserProgressSchema,
    default: { quests: [] }
  },
  settings: {
    type: UserSettingsSchema,
    default: {}
  },
  // Streak related fields
  streak: {
    type: Number,
    default: 0
  },
  lastStreakUpdate: {
    type: Date,
    default: null
  },
  lastCheckIn: {
    type: Date,
    default: null
  },
  checkIns: [{
    date: {
      type: Date,
      required: true
    },
    streak: {
      type: Number,
      required: true
    }
  }]
}, { timestamps: true });

// Check if model exists before creating to avoid overwrite in development
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;