import React, { useState } from 'react';

interface DailyCheckInProps {
  streak: number;
  streakActive: boolean;
  onCheckIn: () => Promise<void>;
  isLoading: boolean;
  totalCheckIns: number;
  alreadyCheckedIn: boolean;
}

const DailyCheckIn: React.FC<DailyCheckInProps> = ({ 
  streak, 
  streakActive, 
  onCheckIn, 
  isLoading,
  totalCheckIns = 0,
  alreadyCheckedIn = false
}) => {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCheckIn = async () => {
    if (alreadyCheckedIn) return;
    
    try {
      await onCheckIn();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Check-in failed:", error);
    }
  };

  return (
    <div className="bg-white border-2 border-[#E5E7EB] rounded-xl p-5 hover:border-[#FF9600] transition-all duration-300 shadow-sm h-full">
      <div className="flex flex-col items-center h-full">
        <div className={`w-20 h-20 rounded-full mb-4 flex items-center justify-center text-white shadow-md
          ${streakActive 
            ? "bg-gradient-to-br from-[#FF9600] to-[#E08600]" 
            : "bg-gradient-to-br from-[#D1D5DB] to-[#9CA3AF]"}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.467 5.99 5.99 0 0 0-1.925 3.545 5.975 5.975 0 0 1-2.133-1.001A6.004 6.004 0 0 1 12 18Z" />
          </svg>
        </div>

        <div className="text-center mb-3">
          <h3 className="font-extrabold text-xl text-[#1F2937]">
            {alreadyCheckedIn 
              ? "Already Checked In!" 
              : streakActive 
                ? "Daily Streak Active" 
                : "Maintain Your Streak"}
          </h3>
          <p className="text-[#6B7280] text-sm mt-1">
            {streak} day{streak !== 1 ? 's' : ''} {streakActive ? '🔥' : ''}
          </p>
          {totalCheckIns > 0 && (
            <p className="text-[#6B7280] text-xs mt-1">
              Total check-ins: {totalCheckIns}
            </p>
          )}
        </div>

        {!alreadyCheckedIn && !streakActive ? (
          <button
            onClick={handleCheckIn}
            disabled={isLoading || showSuccess}
            className="w-full bg-gradient-to-r from-[#FF9600] to-[#E08600] text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                <span>Checking in...</span>
              </div>
            ) : showSuccess ? (
              <div className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Checked in!</span>
              </div>
            ) : (
              "Check in for today"
            )}
          </button>
        ) : (
          <div className="w-full bg-[#F1FFEB] text-[#58CC02] font-bold py-3 px-4 rounded-xl text-center border border-[#A6E772]">
            <div className="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{alreadyCheckedIn ? "Already checked in today!" : "Streak active!"}</span>
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-between items-center w-full">
          <div className="flex space-x-1 w-full">
            {Array.from({ length: 7 }).map((_, i) => (
              <div 
                key={i} 
                className={`flex-1 h-2 rounded-full ${
                  i < Math.min(streak % 7 || 7, 7) 
                    ? 'bg-gradient-to-r from-[#FF9600] to-[#E08600]' 
                    : 'bg-[#E5E7EB]'
                }`}
              ></div>
            ))}
          </div>
          <span className="text-xs text-[#6B7280] ml-2 whitespace-nowrap">
            {streak % 7 === 0 ? "Week completed!" : `${7 - (streak % 7)} to go`}
          </span>
        </div>

        <p className="text-xs text-[#6B7280] mt-4 text-center">
          {alreadyCheckedIn
            ? "You're on fire! Come back tomorrow to continue your streak."
            : streakActive 
              ? "You're on a roll! Don't forget to check in today."
              : "Check in daily to build your streak and earn bonus XP!"}
        </p>
      </div>
    </div>
  );
};

export default DailyCheckIn;