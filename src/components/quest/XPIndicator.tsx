import React from "react";

interface XPIndicatorProps {
  earnedXP: number;
  animateXP: boolean;
}

const XPIndicator: React.FC<XPIndicatorProps> = ({ earnedXP, animateXP }) => {
  if (!animateXP) return null;
  
  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 animate-float-up">
      <div className="bg-[#FFC800] text-white font-bold text-2xl px-6 py-3 rounded-full shadow-lg">
        +{earnedXP} XP
      </div>
    </div>
  );
};

export default XPIndicator;