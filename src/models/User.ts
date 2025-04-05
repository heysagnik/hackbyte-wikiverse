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
  }
}, { timestamps: true });

// Check if model exists before creating to avoid overwrite in development
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;