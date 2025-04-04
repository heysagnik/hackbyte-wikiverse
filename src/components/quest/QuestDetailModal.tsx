import React, { useState, useEffect } from "react";
import { Quest } from "../../app/types";

interface QuestDetailModalProps {
  selectedQuest: Quest | null;
  setSelectedQuest: (quest: Quest | null) => void;
  handleCompleteTask: (questId: string, taskId: string) => void;
}

interface MCQ {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
}

const sampleMCQs: MCQ[] = [
  {
    id: "q1",
    question: "What is one of Wikipedia's core principles?",
    options: [
      { id: "q1a", text: "Neutrality" },
      { id: "q1b", text: "Bias" },
      { id: "q1c", text: "Exclusivity" },
    ],
    correctOptionId: "q1a",
  },
  {
    id: "q2",
    question: "Which step is important before editing?",
    options: [
      { id: "q2a", text: "Jump right in without research" },
      { id: "q2b", text: "Read about the five pillars" },
      { id: "q2c", text: "Ignore guidelines" },
    ],
    correctOptionId: "q2b",
  },
  {
    id: "q3",
    question: "What must you add when making an edit?",
    options: [
      { id: "q3a", text: "An edit summary" },
      { id: "q3b", text: "A random image" },
      { id: "q3c", text: "Multiple errors" },
    ],
    correctOptionId: "q3a",
  },
];

const QuestDetailModal: React.FC<QuestDetailModalProps> = ({
  selectedQuest,
  setSelectedQuest,
  handleCompleteTask,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [showAnswerFeedback, setShowAnswerFeedback] = useState<{
    questionId: string;
    isCorrect: boolean;
    message: string;
  } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [progressTimer, setProgressTimer] = useState(100);
  const [headerMessage, setHeaderMessage] = useState("Get ready to learn...");
  const [shake, setShake] = useState(false);

  const playCorrectSound = () => console.log("Correct sound played");
  const playIncorrectSound = () => console.log("Incorrect sound played");

  useEffect(() => {
    if (currentStep === 1) {
      setHeaderMessage("Get ready to learn...");
    } else if (currentStep === 2) {
      setHeaderMessage("Study these concepts");
    } else if (currentStep === 3) {
      setHeaderMessage("Knowledge check");
    } else {
      setHeaderMessage("Lesson complete!");
    }

    if (currentStep === 3) {
      const timer = setInterval(() => {
        setProgressTimer((prev) => {
          if (prev <= 0) return 0;
          return prev - 0.5;
        });
      }, 100);

      return () => clearInterval(timer);
    }
  }, [currentStep]);

  if (!selectedQuest) return null;

  const progressPercent = Math.round((currentStep / totalSteps) * 100);
  const currentMCQ = sampleMCQs[currentQuestion];
  const suggestedXP = Math.round((score / sampleMCQs.length) * selectedQuest.xpReward);
  
  const getPrimaryColor = () => {
    switch(selectedQuest.level) {
      case "beginner": return { bg: "#58CC02", text: "#E5F8DF" };
      case "intermediate": return { bg: "#1CB0F6", text: "#E5F6FB" };
      case "advanced": return { bg: "#FF9600", text: "#FFF4E5" };
      default: return { bg: "#58CC02", text: "#E5F8DF" };
    }
  };
  
  const primaryColors = getPrimaryColor();

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    setShowAnswerFeedback(null);
    setProgressTimer(100);
  };

  const handleAnswerSelect = (questionId: string, optionId: string) => {
    const question = sampleMCQs.find(q => q.id === questionId);
    if (!question) return;
    
    const isCorrect = optionId === question.correctOptionId;
    
    if (!isCorrect) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      playIncorrectSound();
    } else {
      playCorrectSound();
    }
    
    setShowAnswerFeedback({
      questionId,
      isCorrect,
      message: isCorrect ? "Correct! 🎉" : "Not quite right"
    });
    
    if (isCorrect) {
      setTimeout(() => {
        if (currentQuestion < sampleMCQs.length - 1) {
          setCurrentQuestion(prev => prev + 1);
          setProgressTimer(100);
        } else {
          const finalScore = Object.keys(selectedAnswers).filter(
            qId => selectedAnswers[qId] === sampleMCQs.find(q => q.id === qId)?.correctOptionId
          ).length + 1;
          
          setScore(finalScore);
          setShowConfetti(true);
          setTimeout(() => {
            setCurrentStep(totalSteps);
          }, 1000);
        }
        setShowAnswerFeedback(null);
      }, 1200);
    } else {
      setHearts(prev => Math.max(0, prev - 1));
      
      if (hearts <= 1) {
        setTimeout(() => {
          const partialScore = Object.keys(selectedAnswers).filter(
            qId => selectedAnswers[qId] === sampleMCQs.find(q => q.id === qId)?.correctOptionId
          ).length;
          
          setScore(partialScore);
          setCurrentStep(totalSteps);
          setShowAnswerFeedback(null);
        }, 1500);
      }
    }
    
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const completeQuest = () => {
    if (selectedQuest && selectedQuest.tasks.length > 0) {
      handleCompleteTask(selectedQuest.id, selectedQuest.tasks[0].id);
    }
    
    setCurrentStep(1);
    setSelectedAnswers({});
    setScore(0);
    setCurrentQuestion(0);
    setHearts(3);
    setSelectedQuest(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-0 md:p-4">
      <div className="bg-white w-full h-full md:max-w-lg md:h-auto md:max-h-[90vh] md:rounded-2xl overflow-hidden shadow-2xl relative flex flex-col">
        <header 
          className="text-white p-3 flex items-center justify-between"
          style={{ backgroundColor: primaryColors.bg }}
        >
          <button
            onClick={() => setSelectedQuest(null)}
            className="text-white p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
        </header>
        
        <div className="h-2.5 bg-[#E5E5E5] w-full">
          <div 
            className="h-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%`, backgroundColor: primaryColors.bg }}
          ></div>
        </div>

        {currentStep === 3 && (
          <div className="h-1 bg-[#E5E5E5] w-full">
            <div 
              className="h-full bg-[#FF9600] transition-all duration-100 ease-linear"
              style={{ width: `${progressTimer}%` }}
            ></div>
          </div>
        )}
        
        <div className="flex-grow overflow-auto p-5 bg-white">
          {currentStep === 1 && (
            <div className="flex flex-col h-full">
              <h1 className="text-2xl font-bold text-[#4B4B4B] mb-4">
                {selectedQuest.title}
              </h1>
              
              <p className="text-[#777777] mb-6">
                {selectedQuest.description}
              </p>
              
              <div 
                className="rounded-xl p-4 mb-6 w-full"
                style={{ backgroundColor: primaryColors.text }}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={primaryColors.bg} className="w-6 h-6 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  <span className="font-bold" style={{ color: primaryColors.bg }}>Tip</span>
                </div>
                <p className="text-[#777777] mt-2">
                  This lesson will teach you about Wikipedia best practices. Complete the quiz to earn XP!
                </p>
              </div>
              
              <div className="mt-auto">
                <button 
                  onClick={handleNext}
                  className="w-full h-14 text-white font-bold text-lg rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                  style={{ backgroundColor: primaryColors.bg }}
                >
                  START
                </button>
              </div>
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="flex flex-col h-full">
              <div className="bg-[#F7F7F7] p-5 rounded-xl mb-6">
                <h2 className="text-xl font-bold text-[#4B4B4B] mb-4">The Five Pillars of Wikipedia</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="rounded-lg p-1.5 mr-3" style={{ backgroundColor: primaryColors.text }}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke={primaryColors.bg} className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-[#4B4B4B]">Neutrality</h3>
                      <p className="text-[#777777]">Articles must be written from a neutral point of view.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="rounded-lg p-1.5 mr-3" style={{ backgroundColor: primaryColors.text }}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke={primaryColors.bg} className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-[#4B4B4B]">Verifiability</h3>
                      <p className="text-[#777777]">Information must be verifiable through reliable sources.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="rounded-lg p-1.5 mr-3" style={{ backgroundColor: primaryColors.text }}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke={primaryColors.bg} className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-[#4B4B4B]">No Original Research</h3>
                      <p className="text-[#777777]">Wikipedia does not publish original thought.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-auto">
                <button 
                  onClick={handleNext}
                  className="w-full h-14 text-white font-bold text-lg rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                  style={{ backgroundColor: primaryColors.bg }}
                >
                  CONTINUE
                </button>
              </div>
            </div>
          )}
          
          {currentStep === 3 && (
            <div className={`flex flex-col h-full ${shake ? 'animate-shake' : ''}`}>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-[#4B4B4B] mb-1">
                  {currentMCQ.question}
                </h2>
                <p className="text-[#777777] text-sm">
                  Select the correct answer
                </p>
              </div>
              
              <div className="space-y-3 mb-6">
                {currentMCQ.options.map((option) => {
                  const isSelected = selectedAnswers[currentMCQ.id] === option.id;
                  const isCorrect = option.id === currentMCQ.correctOptionId;
                  const showCorrect = showAnswerFeedback && isCorrect;
                  const showIncorrect = showAnswerFeedback && isSelected && !isCorrect;
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => !showAnswerFeedback && handleAnswerSelect(currentMCQ.id, option.id)}
                      disabled={showAnswerFeedback !== null}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        showCorrect
                          ? "border-[#58CC02] bg-[#E5F8DF]"
                          : showIncorrect
                            ? "border-[#FF4B4B] bg-[#FFDFE0]"
                            : isSelected
                              ? "border-[#84D8FF] bg-[#E5F6FB]"
                              : "border-[#E5E5E5] hover:border-[#84D8FF] hover:bg-[#E5F6FB]"
                      }`}
                    >
                      {option.text}
                      
                      {showCorrect && (
                        <span className="float-right">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#58CC02" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        </span>
                      )}
                      
                      {showIncorrect && (
                        <span className="float-right">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#FF4B4B" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              
              {showAnswerFeedback && (
                <div className={`p-4 rounded-xl flex items-center mb-6 ${
                  showAnswerFeedback.isCorrect 
                    ? "bg-[#E5F8DF] text-[#58CC02]" 
                    : "bg-[#FFDFE0] text-[#FF4B4B]"
                }`}>
                  {showAnswerFeedback.isCorrect ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  <span className="font-bold">{showAnswerFeedback.message}</span>
                </div>
              )}
              
              {showAnswerFeedback ? (
                <div className="mt-auto">
                  <button 
                    onClick={() => {
                      if (currentQuestion < sampleMCQs.length - 1) {
                        setCurrentQuestion(prev => prev + 1);
                        setShowAnswerFeedback(null);
                        setProgressTimer(100);
                      } else {
                        const finalScore = Object.keys(selectedAnswers).filter(
                          qId => selectedAnswers[qId] === sampleMCQs.find(q => q.id === qId)?.correctOptionId
                        ).length + (showAnswerFeedback.isCorrect ? 1 : 0);
                        
                        setScore(finalScore);
                        setCurrentStep(totalSteps);
                      }
                    }}
                    className="w-full h-14 text-white font-bold text-lg rounded-xl shadow-md hover:shadow-lg transition-all"
                    style={{ backgroundColor: primaryColors.bg }}
                  >
                    CONTINUE
                  </button>
                </div>
              ) : (
                <div className="mt-auto">
                  <button 
                    onClick={() => {
                      if (currentQuestion < sampleMCQs.length - 1) {
                        setCurrentQuestion(prev => prev + 1);
                        setProgressTimer(100);
                      } else {
                        const finalScore = Object.keys(selectedAnswers).filter(
                          qId => selectedAnswers[qId] === sampleMCQs.find(q => q.id === qId)?.correctOptionId
                        ).length;
                        setScore(finalScore);
                        setCurrentStep(totalSteps);
                      }
                    }}
                    className="w-full h-14 bg-[#E5E5E5] text-[#AFAFAF] font-bold text-lg rounded-xl"
                  >
                    SKIP
                  </button>
                </div>
              )}
            </div>
          )}
          
          {currentStep === 4 && (
            <div className="flex flex-col h-full">
              <h1 className="text-2xl font-bold text-[#4B4B4B] mb-4 text-center">
                {score === sampleMCQs.length ? "Perfect Score!" : score > 0 ? "Good Job!" : "Keep Practicing!"}
              </h1>
              
              <div className="rounded-xl p-5 mb-6 flex flex-col items-center" style={{ backgroundColor: primaryColors.text }}>
                <div className="text-4xl font-bold mb-1" style={{ color: primaryColors.bg }}>
                  +{suggestedXP} XP
                </div>
                <div style={{ color: primaryColors.bg }}>
                  {score} of {sampleMCQs.length} correct
                </div>
              </div>
              
              <div className="w-full mb-8">
                <div className="flex justify-between mb-2">
                  <span className="text-[#777777]">Progress</span>
                  <span className="font-bold" style={{ color: primaryColors.bg }}>
                    {Math.round((score / sampleMCQs.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-[#E5E5E5] rounded-full h-3">
                  <div 
                    className="h-3 rounded-full" 
                    style={{ 
                      width: `${(score / sampleMCQs.length) * 100}%`,
                      backgroundColor: primaryColors.bg
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="mt-auto">
                <button 
                  onClick={completeQuest}
                  className="w-full h-14 text-white font-bold text-lg rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                  style={{ backgroundColor: primaryColors.bg }}
                >
                  COMPLETE LESSON
                </button>
              </div>
            </div>
          )}
        </div>
        
        {showConfetti && (
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
        )}
      </div>
      
      <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(${Math.random() * 360}deg);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
};

export default QuestDetailModal;