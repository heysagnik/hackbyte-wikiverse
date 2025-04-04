import { useState, useEffect } from 'react';
import { LearningPath, Quest, QuestLevel } from '../types';

export const useQuestData = () => {
  const [loading, setLoading] = useState(true);
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [activeLevel, setActiveLevel] = useState<QuestLevel>("beginner");
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completedQuest, setCompletedQuest] = useState<Quest | null>(null);
  const [earnedXP, setEarnedXP] = useState(0);
  const [animateXP, setAnimateXP] = useState(false);

  // Trigger XP animation
  const triggerXPAnimation = (xp: number) => {
    setEarnedXP(xp);
    setAnimateXP(true);
    setTimeout(() => setAnimateXP(false), 2000);
  };

  // Fetch mock data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Mock data with three distinct levels
        const mockData: LearningPath = {
          id: "wiki-essentials",
          title: "Wikipedia Essentials",
          description:
            "Master the fundamentals of Wikipedia editing, citations, and community guidelines.",
          modules: [
            {
              id: "mod-1",
              title: "Getting Started",
              description: "Learn the basics of Wikipedia",
              isLocked: false,
              level: "beginner",
              progress: {
                completedItems: 0,
                isCompleted: false,
                totalItems: 0,
                lastUpdated: '',
                isLocked: false
              },
              quests: [
                {
                  id: "quest-1",
                  title: "Wikipedia Fundamentals",
                  description: "Learn about Wikipedia's core principles",
                  xpReward: 50,
                  level: "beginner",
                  category: "editing",
                  prerequisites: [],
                  progress: {
                    completedItems: 0,
                    isCompleted: false,
                    totalItems: 0,
                    lastUpdated: '',
                    isLocked: false
                  },
                  tasks: [
                    { id: "task-1-1", title: "Read about the five pillars", isCompleted: false },
                    { id: "task-1-2", title: "Create your account", isCompleted: false },
                    { id: "task-1-3", title: "Set up your user page", isCompleted: false }
                  ]
                },
                {
                  id: "quest-2",
                  title: "Your First Edit",
                  description: "Make your first contribution to Wikipedia",
                  xpReward: 100,
                  level: "beginner",
                  category: "editing",
                  prerequisites: [],
                  progress: {
                    completedItems: 0,
                    isCompleted: false,
                    totalItems: 0,
                    lastUpdated: '',
                    isLocked: false
                  },
                  tasks: [
                    { id: "task-2-1", title: "Find an article to improve", isCompleted: false },
                    { id: "task-2-2", title: "Make a small edit", isCompleted: false },
                    { id: "task-2-3", title: "Add an edit summary", isCompleted: false }
                  ]
                }
              ]
            }, // <-- Added missing comma and closing bracket here
            {
              id: "mod-2",
              title: "Citations and References",
              description: "Learn how to add reliable sources",
              isLocked: false,
              level: "intermediate",
              progress: {
                completedItems: 0,
                isCompleted: false,
                totalItems: 0,
                lastUpdated: '',
                isLocked: false
              },
              quests: [
                {
                  id: "quest-3",
                  title: "Finding Reliable Sources",
                  description: "Learn to identify and use reliable sources",
                  xpReward: 150,
                  level: "intermediate",
                  category: "editing",
                  prerequisites: [],
                  progress: {
                    completedItems: 0,
                    isCompleted: false,
                    totalItems: 0,
                    lastUpdated: '',
                    isLocked: false
                  },
                  tasks: [
                    { id: "task-3-1", title: "Understand reliability criteria", isCompleted: false },
                    { id: "task-3-2", title: "Find academic sources", isCompleted: false },
                    { id: "task-3-3", title: "Evaluate news sources", isCompleted: false }
                  ]
                },
                {
                  id: "quest-4",
                  title: "Citation Formatting",
                  description: "Master different citation styles",
                  xpReward: 200,
                  level: "intermediate",
                  category: "editing",
                  prerequisites: [],
                  progress: {
                    completedItems: 0,
                    isCompleted: false,
                    totalItems: 0,
                    lastUpdated: '',
                    isLocked: false
                  },
                  tasks: [
                    { id: "task-4-1", title: "Use citation templates", isCompleted: false },
                    { id: "task-4-2", title: "Add inline citations", isCompleted: false },
                    { id: "task-4-3", title: "Create a references section", isCompleted: false }
                  ]
                }
              ]
            },
            {
              id: "mod-3",
              title: "Advanced Editing",
              description: "Master complex editing tasks",
              isLocked: true,
              level: "advanced",
              progress: {
                completedItems: 0,
                isCompleted: false,
                totalItems: 0,
                lastUpdated: '',
                isLocked: true
              },
              quests: [
                {
                  id: "quest-5",
                  title: "Template Usage",
                  description: "Work with complex templates",
                  xpReward: 250,
                  level: "advanced",
                  category: "editing",
                  prerequisites: [],
                  progress: {
                    completedItems: 0,
                    isCompleted: false,
                    totalItems: 0,
                    lastUpdated: '',
                    isLocked: false
                  },
                  tasks: [
                    { id: "task-5-1", title: "Understand template syntax", isCompleted: false },
                    { id: "task-5-2", title: "Add infoboxes", isCompleted: false },
                    { id: "task-5-3", title: "Customize templates", isCompleted: false }
                  ]
                },
                {
                  id: "quest-6",
                  title: "Article Assessment",
                  description: "Learn to review and improve articles",
                  xpReward: 300,
                  level: "advanced",
                  category: "editing",
                  prerequisites: [],
                  progress: {
                    completedItems: 0,
                    isCompleted: false,
                    totalItems: 0,
                    lastUpdated: '',
                    isLocked: false
                  },
                  tasks: [
                    { id: "task-6-1", title: "Review an article", isCompleted: false },
                    { id: "task-6-2", title: "Suggest improvements", isCompleted: false },
                    { id: "task-6-3", title: "Work toward featured status", isCompleted: false }
                  ]
                }
              ]
            }
          ]
        };

        setLearningPath(mockData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching learning path data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelectLevel = (level: QuestLevel) => {
    setActiveLevel(level);
  };

  const handleCompleteTask = (questId: string, taskId: string) => {
    if (!learningPath) return;

    const updatedPath = JSON.parse(JSON.stringify(learningPath)) as LearningPath;
    let justCompletedQuest = false;
    let completedQuestObj: Quest | null = null;
    let xpEarned = 0;

    updatedPath.modules.forEach((module) => {
      const quest = module.quests.find((q) => q.id === questId);
      if (quest) {
        const task = quest.tasks.find((t) => t.id === taskId);
        if (task) {
          const prevCompletionStatus = task.isCompleted;
          task.isCompleted = !prevCompletionStatus;

          const completedTasks = quest.tasks.filter((t) => t.isCompleted).length;
          quest.progress.completedItems = completedTasks;

          // Check if quest was just completed with this task
          if (!quest.progress.isCompleted && completedTasks === quest.tasks.length) {
            justCompletedQuest = true;
            completedQuestObj = JSON.parse(JSON.stringify(quest));
            xpEarned = quest.xpReward;
          }

          quest.progress.isCompleted = completedTasks === quest.tasks.length;

          const totalModuleItems = module.quests.reduce(
            (sum, q) => sum + q.tasks.length,
            0
          );
          const completedModuleItems = module.quests.reduce(
            (sum, q) => sum + q.tasks.filter((t) => t.isCompleted).length,
            0
          );
          module.progress.completedItems = completedModuleItems;
          module.progress.isCompleted = completedModuleItems === totalModuleItems;
        }
      }
    });

    setLearningPath(updatedPath);

    // If a quest was just completed, show completion modal
    if (justCompletedQuest && completedQuestObj) {
      setCompletedQuest(completedQuestObj);
      setEarnedXP(xpEarned);
      setTimeout(() => {
        setShowCompletionModal(true);
      }, 500);
    }
  };

  // Get modules for the current level
  const currentLevelModules = learningPath?.modules.filter(
    module => module.level === activeLevel
  ) || [];

  const userProgress = () => {
    if (!learningPath) return { completed: 0, total: 0, percent: 0 };

    const totalTasks = learningPath.modules.reduce(
      (sum, module) =>
        sum +
        module.quests.reduce((sum, quest) => sum + quest.tasks.length, 0),
      0
    );

    const completedTasks = learningPath.modules.reduce(
      (sum, module) =>
        sum +
        module.quests.reduce(
          (sum, quest) => sum + quest.tasks.filter((t) => t.isCompleted).length,
          0
        ),
      0
    );

    return {
      completed: completedTasks,
      total: totalTasks,
      percent: Math.round((completedTasks / totalTasks) * 100) || 0,
    };
  };

  return {
    loading,
    learningPath,
    selectedQuest,
    setSelectedQuest,
    activeLevel,
    handleSelectLevel,
    showCompletionModal,
    setShowCompletionModal,
    completedQuest,
    earnedXP,
    animateXP,
    triggerXPAnimation,
    handleCompleteTask,
    currentLevelModules,
    userProgress,
  };
};