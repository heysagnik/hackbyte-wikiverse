export type QuestLevel = "beginner" | "intermediate" | "advanced";

export type QuestCategory =
  | "editing"
  | "citation"
  | "formatting"
  | "community"
  | "research"
  | "policy";

export interface QuestProgress {
  completedItems: number;
  totalItems: number;
  lastUpdated: string;
  isLocked: boolean;
  isCompleted: boolean;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  level: QuestLevel;
  category: QuestCategory;
  xpReward: number;
  progress: QuestProgress;
  prerequisites: string[];
  tasks: {
    id: string;
    title: string;
    isCompleted: boolean;
  }[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  level: QuestLevel;
  quests: Quest[];
  isLocked: boolean;
  progress: QuestProgress;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  modules: Module[];
}