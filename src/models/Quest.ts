import mongoose, { Schema } from 'mongoose';

// Option Schema
const MCQOptionSchema = new Schema({
  id: String,
  text: String
});

// Question Schema
const MCQSchema = new Schema({
  id: String,
  question: String,
  options: [MCQOptionSchema],
  correctOptionId: String
});

// Task Schema
const TaskSchema = new Schema({
  id: String,
  title: String,
  description: String,
  completed: {
    type: Boolean,
    default: false
  }
});

// Learning Content Schema
const ContentItemSchema = new Schema({
  title: String,
  description: String
});

// Learning Content Schema
const LearningContentSchema = new Schema({
  title: String,
  items: [ContentItemSchema]
});

// Quest Schema
const QuestSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  moduleId: {
    type: Schema.Types.ObjectId,
    ref: 'Module'
  },
  xpReward: {
    type: Number,
    default: 10
  },
  tasks: [TaskSchema],
  questions: [MCQSchema],
  learningContent: LearningContentSchema
}, { timestamps: true });

// Check if model exists before creating to avoid overwrite in development
const Quest = mongoose.models.Quest || mongoose.model('Quest', QuestSchema);

export default Quest;