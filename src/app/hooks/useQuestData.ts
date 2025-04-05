import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

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
  questions?: {
    id: string;
    question: string;
    options: { id: string; text: string }[];
    correctOptionId: string;
  }[];
  learningContent?: {
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

export function useQuestData() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Quest and module state
  const [allModules, setAllModules] = useState<Module[]>([]);
  const [groupedModules, setGroupedModules] = useState<{
    beginner: Module[];
    intermediate: Module[];
    advanced: Module[];
  }>({
    beginner: [],
    intermediate: [],
    advanced: [],
  });
  
  const [currentLevelModules, setCurrentLevelModules] = useState<Module[]>([]);
  const [activeLevel, setActiveLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  
  // User-related state
  const [userProgress, setUserProgress] = useState<any>(null);
  const [learningPath, setLearningPath] = useState({
    totalModules: 0,
    totalQuests: 0,
    levels: {
      beginner: 0,
      intermediate: 0,
      advanced: 0
    }
  });
  
  // Quest interaction state
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [completedQuest, setCompletedQuest] = useState<Quest | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  const [animateXP, setAnimateXP] = useState(false);

  // Fetch modules and quests when authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      fetchModulesAndQuests();
      fetchUserProgress();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status]);

  // Update current level modules when level changes
  useEffect(() => {
    setCurrentLevelModules(groupedModules[activeLevel] || []);
  }, [activeLevel, groupedModules]);

  // Fetch all modules and their quests
  const fetchModulesAndQuests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/modules');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch modules: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Process and transform the modules if needed
        const processedModules = data.modules.map((module: any) => ({
          id: module._id || module.id,
          title: module.title,
          description: module.description,
          level: module.level,
          order: module.order,
          quests: module.quests.map((quest: any) => ({
            id: quest._id || quest.id,
            title: quest.title,
            description: quest.description,
            level: quest.level,
            xpReward: quest.xpReward,
            moduleId: quest.moduleId,
            tasks: quest.tasks || []
          }))
        }));
        
        setAllModules(processedModules);
        
        // Group modules by level
        const grouped = {
          beginner: processedModules.filter((m: Module) => m.level === 'beginner'),
          intermediate: processedModules.filter((m: Module) => m.level === 'intermediate'),
          advanced: processedModules.filter((m: Module) => m.level === 'advanced')
        };
        
        setGroupedModules(grouped);
        
        // Calculate learning path stats
        const totalQuests = processedModules.reduce(
          (sum: number, module: Module) => sum + module.quests.length, 
          0
        );
        
        setLearningPath({
          totalModules: processedModules.length,
          totalQuests,
          levels: {
            beginner: grouped.beginner.length,
            intermediate: grouped.intermediate.length,
            advanced: grouped.advanced.length
          }
        });
      } else {
        throw new Error(data.message || 'Failed to fetch modules');
      }
    } catch (err) {
      console.error('Error fetching modules:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Fetch current user progress
  const fetchUserProgress = async () => {
    try {
      const response = await fetch('/api/users/profile');
      
      if (!response.ok) {
        console.warn('Failed to fetch user profile. Status:', response.status);
        return;
      }
      
      const data = await response.json();
      
      if (data.success) {
        setUserProgress(data.user);
      }
    } catch (err) {
      console.error('Error fetching user progress:', err);
    }
  };

  // Handle level tab selection
  const handleSelectLevel = (level: 'beginner' | 'intermediate' | 'advanced') => {
    setActiveLevel(level);
  };

  // Trigger XP animation
  const triggerXPAnimation = (amount: number) => {
    setEarnedXP(amount);
    setAnimateXP(true);
    setTimeout(() => setAnimateXP(false), 3000);
  };

  // Handle completing a quest task
  const handleCompleteTask = async (questId: string, taskId: string) => {
    try {
      // Find the quest in our data
      let foundQuest: Quest | null = null;
      
      for (const module of allModules) {
        const quest = module.quests.find(q => q.id === questId);
        if (quest) {
          foundQuest = quest;
          break;
        }
      }
      
      if (!foundQuest) {
        console.error('Quest not found:', questId);
        return;
      }
      
      setCompletedQuest(foundQuest);
      setShowCompletionModal(true);
      
      // Trigger XP animation
      triggerXPAnimation(foundQuest.xpReward);
      
      // Refresh user data
      await fetchUserProgress();
      
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  return {
    loading,
    error,
    learningPath,
    allModules,
    groupedModules,
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
}