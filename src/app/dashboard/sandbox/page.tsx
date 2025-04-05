"use client";
import React, { useState } from 'react';
import { ChallengesGrid } from '../../../components/editor/ChallengesGrid';
import { ChallengeEditor } from '../../../components/editor/ChallengeEditor';
import { AnalysisFeedback } from '../../../components/editor/AnalysisFeedback';

interface Challenge {
  id: number;
  title: string;
  description: string;
  instructions: string;
}

export default function WikipediaEditorSandbox() {
  // Sample challenge data
  const allChallenges: Challenge[] = [
    {
      id: 1,
      title: "Challenge #1",
      description: "Write an article about a famous historical figure.",
      instructions: "Focus on references and a neutral point of view."
    },
    {
      id: 2,
      title: "Challenge #2",
      description: "Draft a page describing a local event.",
      instructions: "Show introduction, main section, and references."
    },
    {
      id: 3,
      title: "Challenge #3",
      description: "Create an article about a scientific concept.",
      instructions: "Include proper citations and maintain technical accuracy."
    },
    {
      id: 4,
      title: "Challenge #4",
      description: "Write about a cultural tradition from any country.",
      instructions: "Emphasize cultural significance while avoiding bias."
    },
  ];

  const [selectedChallengeId, setSelectedChallengeId] = useState<number | null>(null);
  const [articleContent, setArticleContent] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentChallenge = allChallenges.find(ch => ch.id === selectedChallengeId) || null;

  // Function to return to challenge grid
  const handleReturnToGrid = () => {
    if (isAnalyzing) return; // Don't allow return while analyzing
    setSelectedChallengeId(null);
  };

  // Open modal and start analysis
  async function handleAnalyze() {
    if (isAnalyzing || !currentChallenge) return;
    
    // Open the modal first
    setIsModalOpen(true);
    setIsAnalyzing(true);
    setFeedback("Analyzing your article...");

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleContent,
          articleTitle: currentChallenge.title
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setFeedback(data.feedback);
    } catch (error: any) {
      setFeedback(`Error analyzing: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-green-50 shadow p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-green-700">Sandbox</h1>
          <p className="text-sm text-gray-600 mt-2 mb-1">
            Practice writing Wikipedia-style articles.
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 bg-gray-100">
        {selectedChallengeId && currentChallenge ? (
          // Editor View
          <div className="h-full flex flex-col">
            <ChallengeEditor
              currentChallenge={currentChallenge}
              articleContent={articleContent}
              setArticleContent={setArticleContent}
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
              onReturnToGrid={handleReturnToGrid}
            />
            <AnalysisFeedback
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              feedback={feedback}
              isAnalyzing={isAnalyzing}
            />
          </div>
        ) : (
          // Challenges Grid View
          <>
            <div className="max-w-7xl mx-auto pt-6 pb-4 px-4">
              <h2 className="text-lg font-semibold text-gray-700">Select a challenge to begin:</h2>
            </div>
            <ChallengesGrid
              challenges={allChallenges}
              onSelectChallenge={(id) => {
                setSelectedChallengeId(id);
                setArticleContent("= Article Title =\n\n== Introduction ==\n");
                setFeedback("");
                setIsModalOpen(false);
              }}
            />
          </>
        )}
      </main>
    </div>
  );
}