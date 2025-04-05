import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// Task Progress Schema
const TaskProgressSchema = new Schema({
  taskId: {
    type: Schema.Types.ObjectId,
    ref: 'Task'
  },
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
  quests: [QuestProgressSchema],
  currentLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  }
});

// User Schema
const UserSchema = new Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  image: String,
  totalXP: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  progress: UserProgressSchema
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return;
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to check if password matches
UserSchema.methods.matchPassword = async function(enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
}

// Check if model exists before creating
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;