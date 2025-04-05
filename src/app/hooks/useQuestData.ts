import React, { useState, useEffect } from 'react';
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
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [learningPath, setLearningPath] = useState<string | null>(null);
  const [selectedQuest, setSelectedQuest] = useState<any | null>(null);
  const [activeLevel, setActiveLevel] = useState<string>('beginner');
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completedQuest, setCompletedQuest] = useState<any | null>(null);
  const [earnedXP, setEarnedXP] = useState(0);
  const [animateXP, setAnimateXP] = useState(false);
  const [modules, setModules] = useState<any[]>([]);
  
  interface UserProgress {
    totalXP: number;
    completedQuests: number;
    level: number;
  }

  const [userProgress, setUserProgress] = useState<UserProgress>({
    totalXP: 0,
    completedQuests: 0,
    level: 1
  });

  // Group modules by level
  const groupedModules = React.useMemo(() => {
    return {
      beginner: modules.filter(m => m.level === 'beginner'),
      intermediate: modules.filter(m => m.level === 'intermediate'),
      advanced: modules.filter(m => m.level === 'advanced')
    };
  }, [modules]);

  const currentLevelModules = React.useMemo(() => {
    return groupedModules[activeLevel as keyof typeof groupedModules] || [];
  }, [groupedModules, activeLevel]);

  // Fetch modules and user data
  useEffect(() => {
    if (session?.user?.email) {
      Promise.all([
        fetch('/api/modules').then(res => res.json()),
        fetch('/api/users/profile').then(res => res.json())
      ])
        .then(([modulesData, userData]) => {
          if (modulesData.success) {
            setModules(modulesData.modules);
          } else {
            setError(modulesData.message || 'Failed to load modules');
          }

          if (userData.success) {
            setUserProgress({
              totalXP: userData.user.totalXP || 0,
              completedQuests: userData.user.progress?.quests?.length || 0,
              level: userData.user.level || 1
            });
            setLearningPath(userData.user.learningPath);
          } else {
            setError(userData.message || 'Failed to load user data');
          }
        })
        .catch(err => {
          console.error('Error fetching data:', err);
          setError('Failed to load data. Please try again later.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [session]);

  const handleSelectLevel = (level: string) => {
    setActiveLevel(level);
  };

  // This function handles the XP animation
  const triggerXPAnimation = () => {
    setAnimateXP(true);
    setTimeout(() => setAnimateXP(false), 3000);
  };

  // Modified handleCompleteTask to use the new centralized API
  const handleCompleteTask = async (questId: string, taskId: string, earnedXP?: number) => {
    try {
      // Show loading state
      setLoading(true);
      
      // Use earnedXP directly (default to 10 if not provided)
      const pointsEarned = earnedXP || 10;
      
      // First, update the quest progress
      const response = await fetch(`/api/quests/${questId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId,
          earnedXP: pointsEarned,
        }),
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to update quest progress');
      }
      
      // If quest wasn't already completed, update XP via centralized API
      if (!data.alreadyCompleted) {
        // Make a call to the centralized level API
        const levelResponse = await fetch('/api/users/level', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            xpToAdd: pointsEarned,
          }),
        });
        
        const levelData = await levelResponse.json();
        
        if (levelData.success) {
          // Update userProgress with the latest data
          setUserProgress(prev => ({
            ...prev,
            totalXP: levelData.totalXP,
            level: levelData.currentLevel
          }));
        }
      }
      
      // Find the completed quest
      const completedQuestData = modules
        .flatMap(module => module.quests)
        .find(quest => quest.id === questId);
      
      if (completedQuestData) {
        // Set the completed quest
        setCompletedQuest(completedQuestData);
        
        // Set the earned XP directly
        setEarnedXP(pointsEarned);
        
        // Show completion modal
        setShowCompletionModal(true);
      }
    } catch (error) {
      console.error('Error completing quest:', error);
      setError('Failed to complete quest. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
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
    groupedModules
  };
}