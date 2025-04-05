import React from 'react';
import { ChallengeCard } from './ChallengeCard';

interface Challenge {
  id: number;
  title: string;
  description: string;
}

interface ChallengesGridProps {
  challenges: Challenge[];
  onSelectChallenge: (challengeId: number) => void;
}

export function ChallengesGrid({ challenges, onSelectChallenge }: ChallengesGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
      {challenges.map((challenge) => (
        <ChallengeCard
          key={challenge.id}
          challenge={challenge}
          onSelect={() => onSelectChallenge(challenge.id)}
        />
      ))}
    </div>
  );
}