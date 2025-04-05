"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

// Components
import Header from "@/components/quest/Header";
import LevelTabs from "@/components/quest/LevelTabs";
import QuestPath from "@/components/quest/QuestPath";
import QuestDetailModal from "@/components/quest/QuestDetailModal";
import QuestCompletionModal from "@/components/quest/QuestCompletionModal";
import XPIndicator from "@/components/quest/XPIndicator";

// Hooks
import { useQuestData } from "../../hooks/useQuestData";

export default function QuestsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const {
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
  } = useQuestData();

  // Redirect unauthenticated users
  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] bg-[#FAFDF7]">
        <div className="flex flex-col items-center">
          <div className="relative w-20 h-20">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-[#E5E7EB] rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-t-[#58CC02] rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-[#4B5563] font-bold text-xl">Loading your learning path...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] bg-[#FAFDF7]">
        <div className="flex flex-col items-center p-8 max-w-md text-center">
          <div className="w-20 h-20 rounded-full bg-[#FEE2E2] flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#EF4444" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#1F2937] mb-2">Something went wrong</h2>
          <p className="text-[#6B7280] mb-6">
            We couldn't load your quests. Please try refreshing the page or come back later.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#58CC02] text-white font-medium rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // Calculate module counts for each level
  const moduleCounts = {
    beginner: groupedModules.beginner.length,
    intermediate: groupedModules.intermediate.length,
    advanced: groupedModules.advanced.length
  };

  return (
    <div className="min-h-screen bg-[#FAFDF7]">
      {/* Floating XP indicator */}
      <XPIndicator earnedXP={earnedXP} animateXP={animateXP} />

      {/* Header with progress stats */}
      <Header userProgress={userProgress} learningPath={learningPath} />

      {/* Level Tabs */}
      <LevelTabs 
        activeLevel={activeLevel} 
        handleSelectLevel={handleSelectLevel} 
        counts={moduleCounts}
      />

      {/* Quest Path Visualization */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {currentLevelModules.length > 0 ? (
          <div className="space-y-12">
            {currentLevelModules.map((module: any, moduleIndex: number) => (
              <QuestPath 
                key={module.id}
                module={module}
                moduleIndex={moduleIndex}
                setSelectedQuest={(quest) => setSelectedQuest(quest ? { ...(quest as any), questions: (quest as any).questions || [] } : null)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 rounded-full bg-[#F3F4F6] flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#9CA3AF" className="w-12 h-12">
                <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#1F2937] mb-2">No quests available</h2>
            <p className="text-[#6B7280] max-w-md mx-auto">
              There are no quests available for this level yet. Check back soon or try another level.
            </p>
          </div>
        )}
      </div>

      {/* Quest Detail Modal */}
      <QuestDetailModal
        selectedQuest={selectedQuest ? { ...selectedQuest, questions: selectedQuest.questions || [], learningContent: selectedQuest.learningContent || { title: '', items: [] } } : null}
        setSelectedQuest={setSelectedQuest}
        handleCompleteTask={handleCompleteTask}
      />

      {/* Quest Completion Celebration Modal */}
      <QuestCompletionModal
        showCompletionModal={showCompletionModal}
        completedQuest={completedQuest ? { ...completedQuest, questions: completedQuest.questions || [], learningContent: completedQuest.learningContent || { title: '', items: [] } } : null}
        earnedXP={earnedXP}
        setShowCompletionModal={setShowCompletionModal}
        triggerXPAnimation={triggerXPAnimation}
      />
    </div>
  );
}
