import React from "react";
import { Module, Quest } from "../../app/types";
import QuestCard from "./QuestCard";

interface QuestPathProps {
  module: Module;
  moduleIndex: number;
  setSelectedQuest: (quest: Quest) => void;
}

const QuestPath: React.FC<QuestPathProps> = ({ module, moduleIndex, setSelectedQuest }) => {
  return (
    <div className="relative">
      {/* Module header */}
      <div className="flex items-center mb-6">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white mr-4 
          ${module.level === "beginner" ? "bg-gradient-to-br from-[#58CC02] to-[#46A302]" : 
            module.level === "intermediate" ? "bg-gradient-to-br from-[#1CB0F6] to-[#0A91D3]" : 
            "bg-gradient-to-br from-[#FF9600] to-[#E08600]"}`}
        >
          {module.isLocked ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
            </svg>
          ) : (
            <span className="text-xl font-bold">{moduleIndex + 1}</span>
          )}
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#1F2937]">{module.title}</h2>
          <p className="text-[#6B7280]">{module.description}</p>
        </div>
      </div>

      {/* Quest path visualization */}
      <div className="relative">
        <div className="absolute h-full w-1 bg-[#E5E7EB] left-6 z-0 rounded-full"></div>
        <div className="space-y-4">
          {module.quests.map((quest, index) => (
            <div key={quest.id} className="relative z-10">
              {/* Connecting line filled based on progress */}
              {index > 0 && (
                <div className="absolute w-1 bg-[#E5E7EB] -top-5 h-5 left-6 z-0 rounded-full">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      backgroundColor: module.level === "beginner" ? "#58CC02" : 
                                       module.level === "intermediate" ? "#1CB0F6" : "#FF9600",
                      width: '100%',
                      opacity: quest.progress.isCompleted ? 1 : 0.5
                    }}
                  ></div>
                </div>
              )}
              
              <QuestCard 
                quest={quest}
                moduleLevel={module.level}
                isModuleLocked={module.isLocked}
                setSelectedQuest={setSelectedQuest}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Locked module overlay */}
      {module.isLocked && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded-xl shadow-xl text-center max-w-sm border-2 border-[#E5E7EB] mx-auto my-4">
            <div className="w-16 h-16 bg-[#F3F4F6] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#9CA3AF" className="w-8 h-8">
          <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#1F2937] mb-2">Level Locked</h3>
            <p className="text-[#6B7280] mb-4">Complete previous level challenges to unlock this content.</p>
            <button 
              className="bg-gradient-to-r from-[#58CC02] to-[#46A302] text-white font-bold py-2 px-6 rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              Go to Beginner Level
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestPath;