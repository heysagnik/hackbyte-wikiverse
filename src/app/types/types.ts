export interface Quest {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  xpReward: number;
  moduleId: string;
  tasks: {
    id: string;
    title: string;
    description: string;
    completed?: boolean;
  }[];
  questions: {
    id: string;
    question: string;
    options: { id: string; text: string }[];
    correctOptionId: string;
  }[];
  learningContent: {
    title: string;
    items: {
      title: string;
      description: string;
    }[];
  };
}

export interface Module {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  order: number;
  quests: Quest[];
}

export interface UserProgress {
  currentLevel: 'beginner' | 'intermediate' | 'advanced';
  quests: {
    questId: string;
    completed: boolean;
    score: number;
    earnedXP: number;
    completedAt: Date;
    tasks: {
      taskId: string;
      completed: boolean;
      completedAt: Date;
    }[];
  }[];
}