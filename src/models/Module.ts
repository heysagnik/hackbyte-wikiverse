import mongoose, { Schema } from 'mongoose';

const ModuleSchema = new Schema({
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
  order: {
    type: Number,
    default: 1
  },
  quests: [{
    type: Schema.Types.ObjectId,
    ref: 'Quest'
  }]
}, { timestamps: true });

// Check if model exists before creating
const Module = mongoose.models.Module || mongoose.model('Module', ModuleSchema);

export default Module;