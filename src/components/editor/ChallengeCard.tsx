import React from 'react';
import { Award, BookOpen, ChevronRight } from 'lucide-react'; // Import icons

interface Challenge {
  id: number;
  title: string;
  description: string;
}

interface ChallengeCardProps {
  challenge: Challenge;
  onSelect: () => void;
}

export function ChallengeCard({ challenge, onSelect }: ChallengeCardProps) {
  return (
    <div 
      onClick={onSelect}
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-[#E5E5E5] hover:border-[#58CC02] group"
    >
      {/* Card header with accent color */}
      <div className="h-2 bg-[#58CC02]"></div>
      
      <div className="p-5">
        {/* Challenge number badge */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            <div className="bg-[#FFF4DC] text-[#FF9600] p-1.5 rounded-full mr-2">
              <Award className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold text-gray-500">Challenge #{challenge.id}</span>
          </div>
          
          {/* Right arrow icon that moves on hover */}
          <div className="text-[#58CC02] transform group-hover:translate-x-1 transition-transform">
            <ChevronRight className="h-5 w-5" />
          </div>
        </div>
        
        {/* Title with icon */}
        <div className="flex items-center mb-2">
          <div className="bg-[#E6F8E6] p-2 rounded-full mr-3">
            <BookOpen className="h-5 w-5 text-[#58CC02]" />
          </div>
          <h2 className="text-lg font-bold text-[#4B4B4B]">{challenge.title}</h2>
        </div>
        
        {/* Description */}
        <p className="text-gray-600 text-sm ml-[42px]">{challenge.description}</p>
        
        {/* Start button that appears on hover */}
        <div className="mt-4 ml-[42px] overflow-hidden max-h-0 group-hover:max-h-10 transition-all duration-300">
          <div className="bg-[#58CC02] text-white text-sm font-bold py-1.5 px-4 rounded-xl inline-flex items-center hover:bg-[#46A302] transition-colors">
            Start Challenge
          </div>
        </div>
      </div>
    </div>
  );
}