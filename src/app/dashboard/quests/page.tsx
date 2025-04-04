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
  } = useQuestData();

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

  return (
    <div className="min-h-screen bg-[#FAFDF7]">
      {/* Floating XP indicator */}
      <XPIndicator earnedXP={earnedXP} animateXP={animateXP} />
      
      {/* Header with progress stats */}
      <Header userProgress={userProgress} learningPath={learningPath} />

      {/* Level Tabs */}
      <LevelTabs activeLevel={activeLevel} handleSelectLevel={handleSelectLevel} />

      {/* Quest Path Visualization */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {currentLevelModules.length > 0 ? (
          <div className="space-y-12">
            {currentLevelModules.map((module, moduleIndex) => (
              <QuestPath 
                key={module.id}
                module={module}
                moduleIndex={moduleIndex}
                setSelectedQuest={setSelectedQuest}
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
        selectedQuest={selectedQuest}
        setSelectedQuest={setSelectedQuest}
        handleCompleteTask={handleCompleteTask}
      />

      {/* Quest Completion Celebration Modal */}
      <QuestCompletionModal
        showCompletionModal={showCompletionModal}
        completedQuest={completedQuest}
        earnedXP={earnedXP}
        setShowCompletionModal={setShowCompletionModal}
        triggerXPAnimation={triggerXPAnimation}
      />
    </div>
  );
}

