import React, { useState, useEffect } from "react";
import { Quest } from "@/app/types/types";

interface QuestDetailModalProps {
  selectedQuest: Quest | null;
  setSelectedQuest: (quest: Quest | null) => void;
  handleCompleteTask: (questId: string, taskId: string, earnedXP?: number) => void;
}

export interface MCQ {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
}

const QuestDetailModal: React.FC<QuestDetailModalProps> = ({
  selectedQuest,
  setSelectedQuest,
  handleCompleteTask,
}) => {
  const [questions, setQuestions] = useState<MCQ[]>([]);
  const activeQuestions = questions.length > 0 ? questions : [];
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
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [learningContent, setLearningContent] = useState<any>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const playCorrectSound = () => console.log("Correct sound played");
  const playIncorrectSound = () => console.log("Incorrect sound played");

  useEffect(() => {
    if (selectedQuest) {
      setIsLoading(true);
      setFetchError(null);
      setCurrentStep(1);
      setCurrentQuestion(0);
      setSelectedAnswers({});
      setScore(0);
      setHearts(3);
      setQuizCompleted(false);

      fetch(`/api/quests/${selectedQuest.id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Failed to fetch quest: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          console.log("Quest data received:", data);
          if (data.success) {
            setQuestions(data.questions || []);
            setLearningContent(data.learningContent || selectedQuest.learningContent || { 
              title: 'Learning Content', 
              items: [] 
            });
          } else {
            setFetchError(data.message || "Failed to fetch quest details");
          }
        })
        .catch((err) => {
          console.error("Error fetching quest:", err);
          setFetchError(err.message || "An error occurred while fetching quest data");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [selectedQuest]);

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

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-0 md:p-4">
        <div className="bg-white w-full h-full md:max-w-lg md:h-auto md:max-h-[90vh] md:rounded-2xl overflow-hidden shadow-2xl relative flex flex-col items-center justify-center">
          <div className="flex flex-col items-center p-8">
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-[#E5E5E5] rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-t-[#58CC02] rounded-full animate-spin"></div>
            </div>
            <p className="text-[#4B4B4B] font-medium">Loading quest content...</p>
          </div>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-0 md:p-4">
        <div className="bg-white w-full h-full md:max-w-lg md:h-auto md:max-h-[90vh] md:rounded-2xl overflow-hidden shadow-2xl relative flex flex-col">
          <header className="text-white p-3 flex items-center justify-between bg-[#FF4B4B]">
            <button
              onClick={() => setSelectedQuest(null)}
              className="text-white p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <span className="font-bold">Error</span>
          </header>
          
          <div className="flex-grow p-5 flex flex-col items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#FF4B4B" className="w-16 h-16 mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <p className="text-center text-[#4B4B4B] mb-6">{fetchError}</p>
            <button 
              onClick={() => setSelectedQuest(null)}
              className="w-full h-12 text-white font-bold text-lg rounded-xl shadow-md bg-[#FF4B4B]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progressPercent = Math.round((currentStep / totalSteps) * 100);
  const currentMCQ = activeQuestions[currentQuestion];
  const suggestedXP = Math.round((score / activeQuestions.length) * selectedQuest.xpReward);

  const getPrimaryColor = () => {
    switch (selectedQuest.level) {
      case "beginner":
        return { bg: "#58CC02", text: "#E5F8DF" };
      case "intermediate":
        return { bg: "#1CB0F6", text: "#E5F6FB" };
      case "advanced":
        return { bg: "#FF9600", text: "#FFF4E5" };
      default:
        return { bg: "#58CC02", text: "#E5F8DF" };
    }
  };

  const primaryColors = getPrimaryColor();

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    setShowAnswerFeedback(null);
    setProgressTimer(100);
  };
  
  const handleSelectAnswer = (questionId: string, optionId: string) => {
    if (showAnswerFeedback) return;
    
    setSelectedAnswers({ ...selectedAnswers, [questionId]: optionId });
    
    const question = activeQuestions.find(q => q.id === questionId);
    if (!question) return;
    
    const isCorrect = question.correctOptionId === optionId;
    
    if (isCorrect) {
      playCorrectSound();
      setScore(prev => prev + 1);
      setShowAnswerFeedback({
        questionId,
        isCorrect: true,
        message: "Correct! Good job! 🎉"
      });
    } else {
      playIncorrectSound();
      setHearts(prev => Math.max(0, prev - 1));
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setShowAnswerFeedback({
        questionId,
        isCorrect: false,
        message: "Incorrect. The correct answer is: " + 
          question.options.find(opt => opt.id === question.correctOptionId)?.text
      });
    }
    
    setTimeout(() => {
      if (currentQuestion < activeQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setShowAnswerFeedback(null);
      } else {
        setQuizCompleted(true);
        handleNext();
      }
    }, 2000);
  };
  
  const handleCompleteQuest = () => {
    if (selectedQuest && selectedQuest.tasks && selectedQuest.tasks.length > 0) {
      const taskId = selectedQuest.tasks[0].id;
      handleCompleteTask(selectedQuest.id, taskId, suggestedXP);
      setSelectedQuest(null);
    }
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
          <span className="font-bold text-center flex-1">{headerMessage}</span>
          <div className="w-10"></div>
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
              {learningContent ? (
                <div className="bg-[#F7F7F7] p-5 rounded-xl mb-6">
                  {learningContent.title && (
                    <h2 className="text-xl font-bold text-[#4B4B4B] mb-4">
                      {learningContent.title}
                    </h2>
                  )}
                 
                  {learningContent.items && learningContent.items.length > 0 ? (
                    <div className="space-y-6">
                      {learningContent.items.map((item: any, index: number) => {
                        const isGood = item.title?.toLowerCase().includes("good");
                        
                        return (
                          <div className="rounded-xl p-4" key={index} style={{
                            backgroundColor: isGood ? 'rgba(88, 204, 2, 0.1)' : 'rgba(255, 75, 75, 0.1)',
                            borderLeft: `4px solid ${isGood ? '#58CC02' : '#FF4B4B'}`
                          }}>
                            <div className="flex items-center mb-2">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                                isGood ? 'bg-[#58CC02]' : 'bg-[#FF4B4B]'
                              }`}>
                                {isGood ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="white" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                  </svg>
                                ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="white" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                )}
                              </div>
                              <h3 className={`font-bold ${isGood ? 'text-[#58CC02]' : 'text-[#FF4B4B]'}`}>
                                {item.title}
                              </h3>
                            </div>
                            <div className={`ml-8 p-3 bg-white rounded-lg border ${
                              isGood ? 'border-[#A6E772]' : 'border-[#FF8080]'
                            }`}>
                              <p className="text-[#555555]">{item.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-[#777777]">No additional learning items provided.</p>
                  )}
                </div>
              ) : (
                <div className="bg-[#F7F7F7] p-5 rounded-xl mb-6">
                  <p className="text-[#777777]">No learning content available for this quest.</p>
                </div>
              )}
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

          {/* Step 3: Quiz Questions */}
          {currentStep === 3 && (
            <div className="flex flex-col h-full">
              {/* Hearts and progress indicator */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className={`w-7 h-6 mr-1 ${i < hearts ? 'text-[#FF4B4B]' : 'text-[#E5E7EB]'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                      </svg>
                    </div>
                  ))}
                </div>
                <div className="bg-[#F3F4F6] px-3 py-1 rounded-full">
                  <span className="text-sm font-bold text-[#4B5563]">
                    Question {currentQuestion + 1}/{activeQuestions.length}
                  </span>
                </div>
              </div>

              {/* Current Question */}
              {currentMCQ && (
                <div className={`rounded-xl bg-white p-5 shadow-sm border border-[#E5E7EB] mb-4 ${shake ? 'animate-shake' : ''}`}>
                  <h2 className="text-xl font-bold text-[#1F2937] mb-6">{currentMCQ.question}</h2>
                  
                  <div className="space-y-3">
                    {currentMCQ.options.map((option) => {
                      const isSelected = selectedAnswers[currentMCQ.id] === option.id;
                      const showFeedback = showAnswerFeedback && showAnswerFeedback.questionId === currentMCQ.id;
                      const isCorrect = option.id === currentMCQ.correctOptionId;
                      
                      let borderColor = '#E5E7EB';
                      let bgColor = 'white';
                      
                      if (showFeedback) {
                        if (isCorrect) {
                          borderColor = '#58CC02';
                          bgColor = '#E5F8DF';
                        } else if (isSelected && !isCorrect) {
                          borderColor = '#FF4B4B';
                          bgColor = '#FEF2F2';
                        }
                      } else if (isSelected) {
                        borderColor = '#6366F1';
                        bgColor = '#EEF2FF';
                      }
                      
                      return (
                        <button
                          key={option.id}
                          onClick={() => handleSelectAnswer(currentMCQ.id, option.id)}
                          disabled={!!showAnswerFeedback}
                          className={`w-full p-4 border-2 rounded-xl flex items-center justify-between transition-all duration-150 
                            ${isSelected ? 'font-bold' : 'font-medium'}
                            text-left`}
                          style={{ borderColor, backgroundColor: bgColor }}
                        >
                          <div className="flex items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 border-2 
                              ${isSelected ? (showFeedback && !isCorrect ? 'border-[#FF4B4B] bg-[#FF4B4B]' : 'border-[#6366F1] bg-[#6366F1]') : 'border-[#D1D5DB]'}`}>
                              {isSelected && (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="white" className="w-4 h-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                              )}
                              {showFeedback && isCorrect && !isSelected && (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#58CC02" className="w-4 h-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                              )}
                            </div>
                            <span className="text-[#1F2937]">{option.text}</span>
                          </div>
                          
                          {showFeedback && isCorrect && (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#58CC02" className="w-6 h-6">
                              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                            </svg>
                          )}
                          
                          {showFeedback && !isCorrect && isSelected && (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FF4B4B" className="w-6 h-6">
                              <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l-1.72 1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Feedback message */}
                  {showAnswerFeedback && (
                    <div className={`mt-4 p-3 rounded-lg ${
                      showAnswerFeedback.isCorrect ? 'bg-[#E5F8DF] border border-[#A6E772]' : 'bg-[#FEF2F2] border border-[#FF8080]'
                    }`}>
                      <p className={`text-center font-bold ${
                        showAnswerFeedback.isCorrect ? 'text-[#58CC02]' : 'text-[#FF4B4B]'
                      }`}>
                        {showAnswerFeedback.message}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeQuestions.length === 0 && (
                <div className="bg-[#F9FAFB] rounded-xl p-5 flex flex-col items-center justify-center h-64">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#9CA3AF" className="w-16 h-16 mb-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                  </svg>
                  <h3 className="text-lg font-bold text-[#4B5563] mb-2">No questions available</h3>
                  <p className="text-[#6B7280] text-center">
                    This quest doesn't have any questions yet. 
                    Please try another quest or check back later.
                  </p>
                </div>
              )}
              
              {/* Skip button */}
              {activeQuestions.length > 0 && (
                <div className="mt-auto">
                  <button 
                    onClick={() => {
                      if (!showAnswerFeedback) {
                        if (currentQuestion < activeQuestions.length - 1) {
                          setCurrentQuestion(prev => prev + 1);
                        } else {
                          setQuizCompleted(true);
                          handleNext();
                        }
                      }
                    }}
                    disabled={!!showAnswerFeedback}
                    className={`w-full py-3 rounded-xl font-bold text-[#6366F1] border-2 border-[#6366F1] transition-colors ${
                      showAnswerFeedback ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#EEF2FF]'
                    }`}
                  >
                    Skip this question
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Results */}
          {currentStep === 4 && (
            <div className="flex flex-col h-full">
              <div className="text-center py-4">
                <div className="w-20 h-20 rounded-full bg-[#E5F8DF] flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#58CC02" className="w-12 h-12">
                    <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-[#1F2937] mb-2">
                  Lesson Completed!
                </h2>
                <p className="text-[#6B7280]">
                  You've finished the "{selectedQuest.title}" quest
                </p>
              </div>

              <div className="bg-[#F9FAFB] rounded-xl p-5 mb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[#4B5563] font-bold">Your score</span>
                  <span className="text-[#1F2937] font-extrabold">
                    {score}/{activeQuestions.length} correct
                  </span>
                </div>
                
                <div className="w-full bg-[#E5E7EB] rounded-full h-2.5">
                  <div 
                    className="bg-gradient-to-r from-[#58CC02] to-[#46A302] h-2.5 rounded-full" 
                    style={{ width: `${(score / Math.max(1, activeQuestions.length)) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-[#FFF8E6] p-4 rounded-xl mb-6 flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-[#FFC800] to-[#FFAF00] rounded-full flex items-center justify-center text-white shadow-sm mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                    <path fillRule="evenodd" d="M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm4.5 7.5a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0v-2.25a.75.75 0 01.75-.75zm3.75-1.5a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0V12zm2.25-3a.75.75 0 01.75.75v6.75a.75.75 0 01-1.5 0V9.75A.75.75 0 0113.5 9zm3.75-1.5a.75.75 0 00-1.5 0v9a.75.75 0 001.5 0v-9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-[#92400E] font-bold text-sm">XP Earned</p>
                  <p className="text-[#F59E0B] font-extrabold text-xl">+{suggestedXP} XP</p>
                </div>
              </div>

              <div className="mt-auto">
                <button 
                  onClick={handleCompleteQuest}
                  className="w-full h-14 text-white font-bold text-lg rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 bg-gradient-to-r from-[#58CC02] to-[#46A302]"
                >
                  COMPLETE QUEST
                </button>
              </div>
            </div>
          )}
        </div>
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