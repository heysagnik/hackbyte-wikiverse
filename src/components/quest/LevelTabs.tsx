import React, { useMemo } from "react";
import { QuestLevel } from "../../app/types";

interface LevelTabsProps {
  activeLevel: QuestLevel;
  handleSelectLevel: (level: QuestLevel) => void;
}

const LevelTabs: React.FC<LevelTabsProps> = ({ activeLevel, handleSelectLevel }) => {
  const levelData = useMemo(() => [
    {
      id: "beginner" as QuestLevel,
      label: "Beginner",
      number: 1,
      activeTextColor: "text-[#58CC02]",
      activeBorderColor: "border-[#58CC02]",
      activeBgColor: "bg-[#58CC02]"
    },
    {
      id: "intermediate" as QuestLevel,
      label: "Intermediate",
      number: 2,
      activeTextColor: "text-[#1CB0F6]",
      activeBorderColor: "border-[#1CB0F6]",
      activeBgColor: "bg-[#1CB0F6]"
    },
    {
      id: "advanced" as QuestLevel,
      label: "Advanced",
      number: 3,
      activeTextColor: "text-[#FF9600]",
      activeBorderColor: "border-[#FF9600]",
      activeBgColor: "bg-[#FF9600]"
    }
  ], []);

  return (
    <div className="sticky top-0 bg-white border-b-2 border-[#E5E7EB] shadow-sm z-10 max-h-16 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <nav className="flex overflow-x-auto hide-scrollbar" role="tablist">
          {levelData.map((level) => {
            const isActive = activeLevel === level.id;
            
            return (
              <button
                key={level.id}
                onClick={() => handleSelectLevel(level.id)}
                className={`flex-1 py-2 px-6 font-bold text-center transition-all relative
                  ${isActive 
                    ? `${level.activeTextColor} border-b-4 ${level.activeBorderColor}` 
                    : "text-[#6B7280] hover:text-[#4B5563]"
                  }`}
                aria-selected={isActive}
                role="tab"
              >
                <span className="flex items-center justify-center">
                  {level.label}
                  <span className={`${
                    isActive ? level.activeBgColor : "bg-[#E5E7EB]"
                  } text-white text-xs font-bold px-2 py-0.5 rounded-full ml-2`}>
                    {level.number}
                  </span>
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default React.memo(LevelTabs);