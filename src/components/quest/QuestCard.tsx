import React from "react";
import { Quest } from "../../app/types";

interface QuestCardProps {
  quest: Quest;
  moduleLevel: string;
  isModuleLocked: boolean;
  setSelectedQuest: (quest: Quest) => void;
}

const QuestCard: React.FC<QuestCardProps> = ({ 
  quest, 
  moduleLevel, 
  isModuleLocked, 
  setSelectedQuest 
}) => {
  const isCompleted = quest.progress.isCompleted;
  const progressPercent = (quest.progress.completedItems / quest.progress.totalItems) * 100;
  const questColor = 
    moduleLevel === "beginner" ? "#58CC02" : 
    moduleLevel === "intermediate" ? "#1CB0F6" : "#FF9600";

  return (
    <div 
      onClick={() => !isModuleLocked && setSelectedQuest(quest)}
      className={`
        flex items-start p-5 pl-16 transition-all duration-300 rounded-xl
        ${isModuleLocked 
          ? "bg-[#F3F4F6] border-2 border-[#E5E7EB] opacity-60 cursor-not-allowed" 
          : isCompleted
            ? "bg-white border-2 border-green-200 shadow-md cursor-pointer transform hover:-translate-y-1"
            : "bg-white border-2 border-[#E5E7EB] shadow-sm hover:border-[#58CC02] hover:shadow-md cursor-pointer transform hover:-translate-y-1"
        }
        relative
      `}
    >
      {/* Circle node */}
      <div className="absolute left-4 top-6">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center
          ${isCompleted 
            ? "bg-gradient-to-br from-[#58CC02] to-[#46A302]" 
            : isModuleLocked
              ? "bg-[#E5E7EB]"
              : `bg-white border-2 border-[${questColor}]`
          }
        `}>
          {isCompleted && (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-4 h-4">
              <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 0 1 1.04-.208Z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-[#1F2937]">{quest.title}</h3>
            <p className="text-sm text-[#6B7280] mt-1">{quest.description}</p>
          </div>
          <div className="flex items-center">
            <div className={`text-xs px-3 py-1 rounded-full font-bold
              ${isCompleted 
                ? "bg-[#F1FFEB] text-[#58CC02]" 
                : "bg-[#F3F4F6] text-[#6B7280]"
              }
            `}>
              {quest.xpReward} XP
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[#6B7280]">
              {quest.progress.completedItems}/{quest.progress.totalItems} Tasks
            </span>
            <span className="font-bold text-[#4B5563]">{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full bg-[#F3F4F6] rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-2.5 rounded-full transition-all duration-500 ${
                isCompleted 
                  ? "bg-gradient-to-r from-[#58CC02] to-[#46A302]"
                  : moduleLevel === "beginner" 
                    ? "bg-gradient-to-r from-[#58CC02] to-[#46A302]" 
                    : moduleLevel === "intermediate" 
                      ? "bg-gradient-to-r from-[#1CB0F6] to-[#0A91D3]" 
                      : "bg-gradient-to-r from-[#FF9600] to-[#E08600]"
              }`}
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestCard;