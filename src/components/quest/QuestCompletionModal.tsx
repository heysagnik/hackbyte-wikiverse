import React from "react";
import { Quest } from "@/app/types/types";
import confetti from 'canvas-confetti';

interface QuestCompletionModalProps {
  showCompletionModal: boolean;
  completedQuest: Quest | null;
  earnedXP: number;
  setShowCompletionModal: (show: boolean) => void;
  triggerXPAnimation: (xp: number) => void;
}

const QuestCompletionModal: React.FC<QuestCompletionModalProps> = ({
  showCompletionModal,
  completedQuest,
  earnedXP,
  setShowCompletionModal,
  triggerXPAnimation,
}) => {
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  React.useEffect(() => {
    if (showCompletionModal) {
      triggerConfetti();
    }
  }, [showCompletionModal]);

  if (!showCompletionModal || !completedQuest) return null;
  
  const getPrimaryColor = () => {
    switch(completedQuest.level) {
      case "beginner": return { bg: "#58CC02", text: "#E5F8DF" };
      case "intermediate": return { bg: "#1CB0F6", text: "#E5F6FB" };
      case "advanced": return { bg: "#FF9600", text: "#FFF4E5" };
      default: return { bg: "#58CC02", text: "#E5F8DF" };
    }
  };
  
  const primaryColors = getPrimaryColor();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-0 md:p-4">
      <div className="bg-white w-full h-auto md:max-w-lg md:h-auto md:rounded-2xl overflow-hidden shadow-2xl relative flex flex-col">
        <header 
          className="text-white p-3 flex items-center justify-between"
          style={{ backgroundColor: primaryColors.bg }}
        >
          <div className="w-6"></div> {/* Empty div for spacing */}
          <h3 className="font-bold">Quest Complete!</h3>
          <div className="w-6"></div> {/* Empty div for spacing */}
        </header>

        <div className="h-1 w-full bg-gradient-to-r from-[#58CC02] via-[#1CB0F6] to-[#FF9600]"></div>
        
        <div className="flex-grow p-5 bg-white flex flex-col items-center">
          <div className="w-20 h-20 mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: primaryColors.text }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-white animate-pulse"
                 style={{ backgroundColor: primaryColors.bg }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.75.75 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Zm3.094 8.016a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-[#4B4B4B] mb-2 text-center">{completedQuest.title}</h2>
          <p className="text-[#777777] mb-6 text-center">You've successfully completed this quest!</p>
          
          <div className="rounded-xl p-5 mb-6 w-full flex flex-col items-center" style={{ backgroundColor: primaryColors.text }}>
            <div className="text-4xl font-bold mb-1 flex items-center justify-center" style={{ color: primaryColors.bg }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 mr-2">
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
              +{earnedXP} XP
            </div>
            <div style={{ color: primaryColors.bg }}>
              Experience Points Earned
            </div>
          </div>
          
          <button
            onClick={() => {
              setShowCompletionModal(false);
              triggerXPAnimation(earnedXP);
            }}
            className="w-full h-14 text-white font-bold text-lg rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            style={{ backgroundColor: primaryColors.bg }}
          >
            CONTINUE
          </button>
        </div>
        
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full opacity-80"
              style={{
                backgroundColor: ['#FF9600', '#58CC02', '#1CB0F6', '#FF4B4B'][Math.floor(Math.random() * 4)],
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                top: '-20px',
                left: `${Math.random() * 100}%`,
                animation: `fall ${Math.random() * 2 + 2}s linear forwards`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(${Math.random() * 360}deg);
          }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .animate-pulse {
          animation: pulse 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default QuestCompletionModal;