import React, { useEffect, useState } from 'react';
import { Quest } from '@/app/types/types';

interface QuestCompletionModalProps {
  showCompletionModal: boolean;
  completedQuest: Quest | null;
  earnedXP: number;
  setShowCompletionModal: (show: boolean) => void;
  triggerXPAnimation: () => void;
}

const QuestCompletionModal: React.FC<QuestCompletionModalProps> = ({
  showCompletionModal,
  completedQuest,
  earnedXP,
  setShowCompletionModal,
  triggerXPAnimation,
}) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [leveledUp, setLeveledUp] = useState(false);
  const [newLevel, setNewLevel] = useState(1);
  const [xpProgress, setXpProgress] = useState({
    total: 0,
    forNextLevel: 0,
    percentage: 0,
  });

  // Update the useEffect that checks for level up
  useEffect(() => {
    if (showCompletionModal && completedQuest) {
      setShowConfetti(true);
      
      // Fetch updated user level info from the centralized API
      fetch('/api/users/level')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            const userLevel = data.currentLevel;
            
            // Check if the user's level is different from when they started
            const storedLevel = localStorage.getItem('userLevel');
            const prevLevel = storedLevel ? parseInt(storedLevel) : 1;
            
            if (userLevel > prevLevel) {
              setLeveledUp(true);
              setNewLevel(userLevel);
            }
            
            // Store level data for display
            setXpProgress({
              total: data.totalXP,
              forNextLevel: data.xpForNextLevel,
              percentage: data.progressPercent
            });
            
            // Store the current level
            localStorage.setItem('userLevel', userLevel.toString());
          }
        })
        .catch(err => {
          console.error('Error fetching updated level data:', err);
        });
    }
    
    return () => {
      setShowConfetti(false);
      setLeveledUp(false);
    };
  }, [showCompletionModal, completedQuest]);

  if (!showCompletionModal || !completedQuest) return null;

  const handleContinue = () => {
    setShowCompletionModal(false);
    triggerXPAnimation();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-fadeIn">
        {/* Confetti effect */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-6"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-20px`,
                  backgroundColor: [
                    '#58CC02',
                    '#1CB0F6',
                    '#FF9600',
                    '#FF4B4B',
                    '#A560E8',
                  ][Math.floor(Math.random() * 5)],
                  transform: `rotate(${Math.random() * 360}deg)`,
                  animation: `fall ${1 + Math.random() * 3}s linear forwards`,
                  animationDelay: `${Math.random() * 0.5}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Header */}
        <div className="bg-[#58CC02] text-white p-5 text-center relative">
          <h2 className="text-2xl font-bold mb-2">Quest Complete!</h2>
          <p className="text-[#E5F8DF]">You've mastered "{completedQuest.title}"</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* XP Reward */}
          <div className="bg-[#FFF8E6] p-5 rounded-xl mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FFC800] to-[#FFAF00] rounded-full flex items-center justify-center text-white shadow-md mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[#92400E] font-bold text-sm">XP Earned</p>
                  <p className="text-[#F59E0B] font-extrabold text-2xl">+{earnedXP} XP</p>
                </div>
              </div>
              <div className="animate-bounce">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFCC00" className="w-12 h-12">
                  <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Level up notification (conditionally rendered) */}
          {leveledUp && (
            <div className="bg-[#E6F8E6] p-5 rounded-xl mb-6 border-2 border-[#58CC02] animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#58CC02] rounded-full flex items-center justify-center text-white shadow-md mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                      <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[#356A17] font-bold text-sm">Level up!</p>
                    <p className="text-[#58CC02] font-extrabold text-2xl">Level {newLevel}</p>
                  </div>
                </div>
                <div className="animate-bounce">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#58CC02" className="w-12 h-12">
                    <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* Next steps */}
          <div className="text-center mb-6">
            <p className="text-[#4B5563] mb-2">Continue your learning journey with more quests!</p>
          </div>

          <button 
            onClick={handleContinue}
            className="w-full h-14 font-bold text-lg rounded-xl shadow-md transition-transform transform hover:-translate-y-0.5 bg-gradient-to-r from-[#58CC02] to-[#46A302] text-white"
          >
            CONTINUE
          </button>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(${Math.random() * 360}deg);
          }
        }
      `}</style>
    </div>
  );
};

export default QuestCompletionModal;