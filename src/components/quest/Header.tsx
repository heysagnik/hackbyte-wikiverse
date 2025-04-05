import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";

interface HeaderProps {
  userProgress: {
    totalXP: number;
    completedQuests: number;
    level: number;
  };
  learningPath: any;
}

interface LevelInfo {
  currentLevel: number;
  currentLevelXP: number;
  nextLevel: number;
  nextLevelXP: number;
  xpForNextLevel: number;
  xpRequired: number;
  xpProgress: number;
  progressPercent: number;
  totalXP: number;
  maxLevel: boolean;
}

const Header: React.FC<HeaderProps> = ({ userProgress, learningPath }) => {
  const { data: session } = useSession();
  const [levelInfo, setLevelInfo] = useState<LevelInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch level info from the centralized API
  useEffect(() => {
    if (session?.user) {
      fetch('/api/users/level')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setLevelInfo(data);
          }
        })
        .catch(err => {
          console.error("Error fetching level info:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [session, userProgress.totalXP]);
  
  // Calculate overall quest completion
  const completedQuests = userProgress?.completedQuests || 0;
  const totalQuests = 20; // You might want to calculate this dynamically
  const questCompletionPercent = Math.min(100, (completedQuests / totalQuests) * 100);

  return (
    <div className="bg-gradient-to-r from-[#F1FFEB] to-[#E9FFD9] border-b border-[#A6E772]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl text-[#1F2937] font-bold mb-2">
              Your Learning Journey
            </h1>
            <p className="text-[#6B7280] md:text-lg max-w-2xl">
              Complete quests, earn rewards, and master Wikipedia editing skills!
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border-2 border-[#A6E772] p-4 mt-6 md:mt-0 w-full md:max-w-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-[#4B5563]">Your Progress</span>
              <span className="text-sm bg-[#58CC02] text-white px-3 py-1 rounded-full font-bold">
                Level {levelInfo?.currentLevel || userProgress.level || 1}
              </span>
            </div>

            {/* Quest completion progress */}
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[#6B7280]">Completed Quests</span>
                <span className="font-medium">
                  {completedQuests}/{totalQuests}
                </span>
              </div>
              <div className="w-full bg-[#F3F4F6] rounded-full h-2.5">
                <div
                  className="h-2.5 rounded-full bg-gradient-to-r from-[#58CC02] to-[#46A302]"
                  style={{ width: `${questCompletionPercent}%` }}
                ></div>
              </div>
            </div>
            
            {/* Level progress */}
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[#6B7280]">Next Level</span>
                <span className="font-medium">
                  {levelInfo?.totalXP || userProgress.totalXP || 0}/
                  {levelInfo?.xpForNextLevel || (userProgress.level === 1 ? 300 : 800)} XP
                </span>
              </div>
              <div className="w-full bg-[#F3F4F6] rounded-full h-2.5">
                <div
                  className="h-2.5 rounded-full bg-gradient-to-r from-[#1CB0F6] to-[#0096D6]"
                  style={{ width: `${levelInfo?.progressPercent || 0}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FF9600" className="w-5 h-5 mr-1">
                  <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                </svg>
                <span className="text-[#6B7280]">Total XP</span>
              </div>
              <span className="font-bold text-[#FF9600]">
                {levelInfo?.totalXP || userProgress?.totalXP || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;