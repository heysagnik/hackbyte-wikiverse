import React from 'react';
import { Module, Quest } from '@/app/types/types';

interface QuestPathProps {
  module: Module;
  moduleIndex: number;
  setSelectedQuest: React.Dispatch<React.SetStateAction<Quest | null>>;
}

const QuestPath: React.FC<QuestPathProps> = ({ module, moduleIndex, setSelectedQuest }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <div className="bg-[#F8FAFB] p-4 border-b border-gray-100">
        <h2 className="text-xl font-bold text-[#1F2937]">{module.title}</h2>
        <p className="text-[#6B7280]">{module.description}</p>
      </div>
      
      <div className="p-4">
        <div className="flex flex-col gap-4">
          {module.quests.map((quest, questIndex) => (
            <button
              key={quest.id}
              onClick={() => setSelectedQuest(quest)}
              className="flex items-center p-4 bg-white border border-gray-200 hover:border-[#58CC02] rounded-lg transition-all hover:shadow-md"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center mr-4 bg-[#E5F8DF] text-[#58CC02] font-bold">
                {questIndex + 1}
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-[#1F2937]">{quest.title}</h3>
                <p className="text-sm text-[#6B7280]">{quest.description}</p>
              </div>
              <div className="ml-4 flex items-center">
                <span className="text-[#58CC02] font-medium mr-2">+{quest.xpReward} XP</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={2} 
                  stroke="currentColor" 
                  className="w-5 h-5 text-[#9CA3AF]"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestPath;