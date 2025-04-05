import React from 'react';

interface LevelTabsProps {
  activeLevel: 'beginner' | 'intermediate' | 'advanced';
  handleSelectLevel: (level: 'beginner' | 'intermediate' | 'advanced') => void;
  counts?: {
    beginner: number;
    intermediate: number;
    advanced: number;
  };
}

const LevelTabs: React.FC<LevelTabsProps> = ({ 
  activeLevel, 
  handleSelectLevel,
  counts = { beginner: 0, intermediate: 0, advanced: 0 }
}) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-8">
          <button
            onClick={() => handleSelectLevel('beginner')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeLevel === 'beginner'
                ? 'border-[#58CC02] text-[#58CC02]'
                : 'border-transparent text-[#6B7280] hover:text-[#1F2937] hover:border-[#E5E7EB]'
            }`}
          >
            Beginner
            {counts.beginner > 0 && (
              <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                activeLevel === 'beginner' 
                  ? 'bg-[#E5F8DF] text-[#58CC02]' 
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {counts.beginner}
              </span>
            )}
          </button>
          
          <button
            onClick={() => handleSelectLevel('intermediate')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeLevel === 'intermediate'
                ? 'border-[#1CB0F6] text-[#1CB0F6]'
                : 'border-transparent text-[#6B7280] hover:text-[#1F2937] hover:border-[#E5E7EB]'
            }`}
          >
            Intermediate
            {counts.intermediate > 0 && (
              <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                activeLevel === 'intermediate' 
                  ? 'bg-[#E5F6FB] text-[#1CB0F6]' 
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {counts.intermediate}
              </span>
            )}
          </button>
          
          <button
            onClick={() => handleSelectLevel('advanced')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeLevel === 'advanced'
                ? 'border-[#FF9600] text-[#FF9600]'
                : 'border-transparent text-[#6B7280] hover:text-[#1F2937] hover:border-[#E5E7EB]'
            }`}
          >
            Advanced
            {counts.advanced > 0 && (
              <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                activeLevel === 'advanced' 
                  ? 'bg-[#FFF4E5] text-[#FF9600]' 
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {counts.advanced}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LevelTabs;