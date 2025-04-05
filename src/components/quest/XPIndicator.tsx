import React, { useEffect, useState } from 'react';

interface XPIndicatorProps {
  earnedXP: number;
  animateXP: boolean;
}

const XPIndicator: React.FC<XPIndicatorProps> = ({ earnedXP, animateXP }) => {
  const [totalXP, setTotalXP] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (animateXP) {
      // Fetch current XP to display
      fetch('/api/users/profile')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setTotalXP(data.user.totalXP || 0);
          }
        })
        .catch(err => {
          console.error('Error fetching user XP:', err);
        });

      // Show the indicator
      setIsVisible(true);
      
      // Hide after animation completes
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [animateXP]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-24 right-6 z-50 animate-fadeInSlideDown">
      <div className="bg-[#FFF8E6] p-4 rounded-2xl shadow-lg border-2 border-[#FFCC00] flex items-center">
        <div className="w-10 h-10 bg-gradient-to-br from-[#FFC800] to-[#FFAF00] rounded-full flex items-center justify-center text-white shadow-sm mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
          </svg>
        </div>
        <div>
          <div className="flex items-baseline">
            <span className="text-[#F59E0B] font-extrabold text-xl mr-1 animate-pulse">+{earnedXP}</span>
            <span className="text-[#92400E] font-bold">XP</span>
          </div>
          <div className="text-[#92400E] text-xs">Total: {totalXP} XP</div>
        </div>
      </div>
    </div>
  );
};

export default XPIndicator;