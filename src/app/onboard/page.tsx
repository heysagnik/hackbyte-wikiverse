"use client";
import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import * as Form from "@radix-ui/react-form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type UserData = {
  displayName: string;
  avatarId: number | null;
  learningPath: string | null;
  interests: string[];
  bio: string;
};

type Session = {
  user?: {
    name?: string;
    username?: string;
    id?: string;
  };
};

const OnboardingPage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState<UserData>({
    displayName: "",
    avatarId: null,
    learningPath: null,
    interests: [],
    bio: ""
  });

  const totalSteps = 3;

  // Memoize static data
  const avatars = useMemo(() => [
    { id: 1, src: "/avatars/avatar1.png", alt: "Editor avatar" },
    { id: 2, src: "/avatars/avatar2.png", alt: "Researcher avatar" },
    { id: 3, src: "/avatars/avatar3.png", alt: "Librarian avatar" },
    { id: 4, src: "/avatars/avatar4.png", alt: "Curator avatar" },
  ], []);

  const learningPaths = useMemo(() => [
    {
      id: "quickstart",
      title: "Quick Start",
      description: "Learn the basics of editing in just 10 minutes. Perfect for beginners.",
      duration: "10 minutes",
      difficulty: "Beginner"
    },
    {
      id: "full",
      title: "Full Editor Training",
      description: "Comprehensive training on all aspects of Wikipedia editing and policies.",
      duration: "60 minutes",
      difficulty: "Intermediate"
    }
  ], []);

  const interestCategories = useMemo(() => [
    "Science", "History", "Technology", "Arts", "Literature", 
    "Geography", "Mathematics", "Politics", "Philosophy", 
    "Medicine", "Economics", "Sports"
  ], []);

  // Memoize progress calculation
  const progress = useMemo(() => 
    ((step - 1) / (totalSteps - 1)) * 100
  , [step, totalSteps]);

  // Authentication check and profile pre-fill
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
      return;
    }
    
    if (status === "authenticated" && session?.user) {
      // Pre-fill displayName from session
      setUserData(prev => ({
        ...prev,
        displayName: session.user?.name || "",
      }));
      
      // Check if user has already completed onboarding
      const checkOnboardingStatus = async () => {
        try {
          const response = await fetch('/api/users/profile');
          
          // First check if the response is OK before trying to parse JSON
          if (!response.ok) {
            console.warn(`Profile check failed with status: ${response.status}`);
            return; // Exit early, don't try to parse invalid JSON
          }
          
          // Check for content before parsing
          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            console.warn('Response is not JSON. Skipping onboarding check.');
            return;
          }
          
          // Get the response text first to validate it's not empty
          const text = await response.text();
          if (!text || text.trim() === '') {
            console.warn('Empty response from profile API');
            return;
          }
          
          // Parse the JSON safely
          const data = JSON.parse(text);
          
          if (data.user?.hasCompletedOnboarding) {
            // If onboarding is already completed, redirect to dashboard
            router.push('/dashboard');
          }
        } catch (error) {
          // Silently fail - worst case user goes through onboarding again
          console.error('Error checking onboarding status:', error);
          // Do not rethrow - let the user continue with onboarding
        }
      };
      
      checkOnboardingStatus();
    }
  }, [session, status, router]);

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleAvatarSelect = (id: number) => {
    setUserData(prev => ({ ...prev, avatarId: id }));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData(prev => ({ ...prev, displayName: e.target.value }));
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserData(prev => ({ ...prev, bio: e.target.value }));
  };

  const handlePathSelect = (id: string) => {
    setUserData(prev => ({ ...prev, learningPath: id }));
  };

  const handleInterestToggle = (interest: string) => {
    setUserData(prev => {
      const interests = [...prev.interests];
      if (interests.includes(interest)) {
        return {
          ...prev,
          interests: interests.filter(i => i !== interest)
        };
      } else {
        return {
          ...prev,
          interests: [...interests, interest]
        };
      }
    });
  };

  const canProceedToStep2 = userData.displayName.trim().length > 0;
  const canProceedToStep3 = userData.learningPath && userData.interests.length > 0;
  const canSubmit = userData.displayName && userData.avatarId && userData.learningPath && userData.interests.length > 0;

  const handleSubmit = async () => {
    if (!canSubmit) {
      setError("Please complete all required fields before proceeding");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          displayName: userData.displayName,
          bio: userData.bio,
          avatarId: userData.avatarId,
          interests: userData.interests,
          learningPath: userData.learningPath,
          hasCompletedOnboarding: true
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      router.push("/dashboard");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <svg aria-label="Loading indicator" className="animate-spin h-12 w-12 text-[#3366cc]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-[#54595d]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#202122] py-8 px-4">
      <header className="max-w-4xl mx-auto mb-8">
        <h1 className="text-2xl font-serif text-[#162860] text-center mb-6">Welcome to Wikiverse</h1>
        
        <div className="w-full bg-[#eaecf0] rounded-full h-2.5" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div 
            className="bg-[#3366cc] h-2.5 rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-1 text-xs text-[#54595d]">
          <span>Start</span>
          <span>Set up profile</span>
          <span>Complete</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto bg-white border border-[#c8ccd1] rounded-sm p-6 shadow-sm">
        {error && (
          <div className="bg-[#fee7e6] border border-[#ffd2d2] text-[#d33] p-3 rounded-sm text-sm mb-4" role="alert">
            {error}
          </div>
        )}
        
        <motion.div
          key={`step-${step}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-medium text-[#202122] mb-2">Set up your profile</h2>
                <p className="text-sm text-[#54595d]">Tell us about yourself so others can get to know you in the Wikiverse community.</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
                {avatars.map((avatar) => (
                  <div 
                    key={avatar.id}
                    className={`border-2 rounded-lg p-2 cursor-pointer transition-all hover:bg-[#eaf3ff] ${
                      userData.avatarId === avatar.id ? 'border-[#3366cc] bg-[#eaf3ff]' : 'border-[#eaecf0]'
                    }`}
                    onClick={() => handleAvatarSelect(avatar.id)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAvatarSelect(avatar.id)}
                    tabIndex={0}
                    role="radio"
                    aria-checked={userData.avatarId === avatar.id}
                    aria-label={avatar.alt}
                  >
                    <div className="aspect-square relative">
                      <div className="w-full h-full bg-[#f8f9fa] rounded flex items-center justify-center">
                        <span className="text-3xl">{avatar.alt.charAt(0)}</span>
                      </div>
                    </div>
                    <p className="text-xs text-center mt-2">{avatar.alt}</p>
                  </div>
                ))}
              </div>
              
              <Form.Root className="space-y-4">
                <Form.Field name="displayName">
                  <div className="flex flex-col space-y-1.5">
                    <Form.Label className="text-sm font-medium text-[#54595d]">Display Name</Form.Label>
                    <Form.Control asChild>
                      <input
                        className="w-full px-3 py-2 border border-[#a2a9b1] rounded-sm focus:outline-none focus:border-[#3366cc] focus:ring-1 focus:ring-[#3366cc]"
                        type="text"
                        required
                        placeholder="Enter your preferred display name"
                        value={userData.displayName}
                        onChange={handleNameChange}
                        aria-required="true"
                      />
                    </Form.Control>
                    <Form.Message className="text-sm text-[#d33]" match="valueMissing">
                      Please enter a display name
                    </Form.Message>
                  </div>
                </Form.Field>
                
                <Form.Field name="bio">
                  <div className="flex flex-col space-y-1.5">
                    <Form.Label className="text-sm font-medium text-[#54595d]">Bio</Form.Label>
                    <Form.Control asChild>
                      <textarea
                        className="w-full px-3 py-2 border border-[#a2a9b1] rounded-sm focus:outline-none focus:border-[#3366cc] focus:ring-1 focus:ring-[#3366cc]"
                        rows={3}
                        placeholder="Tell the community about yourself (optional)"
                        value={userData.bio}
                        onChange={handleBioChange}
                      />
                    </Form.Control>
                  </div>
                </Form.Field>
              </Form.Root>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-medium text-[#202122] mb-2">Select your interests</h2>
                <p className="text-sm text-[#54595d]">Choose topics you're interested in contributing to or learning about.</p>
              </div>
              
              <div role="group" aria-label="Interest categories" className="grid grid-cols-2 md:grid-cols-3 gap-3 my-6">
                {interestCategories.map((interest) => (
                  <div 
                    key={interest}
                    onClick={() => handleInterestToggle(interest)}
                    onKeyDown={(e) => e.key === 'Enter' && handleInterestToggle(interest)}
                    tabIndex={0}
                    role="checkbox"
                    aria-checked={userData.interests.includes(interest)}
                    className={`border-2 rounded-md p-3 cursor-pointer transition-colors text-center ${
                      userData.interests.includes(interest) 
                        ? 'border-[#3366cc] bg-[#eaf3ff] text-[#3366cc]' 
                        : 'border-[#c8ccd1] hover:bg-[#f8f9fa] text-[#54595d]'
                    }`}
                  >
                    {interest}
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <h2 className="text-xl font-medium text-[#202122] mb-2">Choose your learning path</h2>
                <p className="text-sm text-[#54595d]">Select how you'd like to learn about editing and contributing.</p>
              </div>
              
              <div role="radiogroup" aria-label="Learning paths" className="space-y-4 my-6">
                {learningPaths.map((path) => (
                  <div 
                    key={path.id}
                    className={`border-2 rounded-md p-4 cursor-pointer transition-all hover:bg-[#eaf3ff] ${
                      userData.learningPath === path.id ? 'border-[#3366cc] bg-[#eaf3ff]' : 'border-[#eaecf0]'
                    }`}
                    onClick={() => handlePathSelect(path.id)}
                    onKeyDown={(e) => e.key === 'Enter' && handlePathSelect(path.id)}
                    tabIndex={0}
                    role="radio"
                    aria-checked={userData.learningPath === path.id}
                  >
                    <h3 className="font-medium text-lg text-[#162860]">{path.title}</h3>
                    <p className="text-sm text-[#54595d] mt-1">{path.description}</p>
                    <div className="flex items-center mt-3 text-xs text-[#72777d]">
                      <span className="mr-4">Duration: {path.duration}</span>
                      <span>Difficulty: {path.difficulty}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 text-center">
              <div className="w-20 h-20 bg-[#eaf3ff] rounded-full flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-[#3366cc]" aria-hidden="true">
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365-9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                </svg>
              </div>
              
              <h2 className="text-xl font-medium text-[#202122]">You're all set!</h2>
              <p className="text-sm text-[#54595d] max-w-md mx-auto">
                Your profile has been created and your learning path is ready. 
                Click the button below to start your Wikipedia journey.
              </p>
              
              <div className="pt-4 pb-4">
                <div className="bg-[#f8f9fa] border border-[#eaecf0] rounded-md p-4 text-left max-w-md mx-auto mb-6">
                  <h3 className="font-medium text-[#202122] mb-2">Your profile summary:</h3>
                  
                  <div className="flex items-start space-x-3 mb-2">
                    <div className="w-10 h-10 bg-[#eaf3ff] rounded-full flex items-center justify-center text-[#3366cc] flex-shrink-0">
                      <span className="font-medium">{userData.displayName.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-[#202122]">{userData.displayName}</p>
                      {userData.bio && <p className="text-sm text-[#54595d] mt-1">{userData.bio}</p>}
                    </div>
                  </div>
                  
                  {userData.interests.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-[#54595d] mb-1">Interests:</p>
                      <div className="flex flex-wrap gap-2">
                        {userData.interests.map(interest => (
                          <span key={interest} className="text-xs bg-[#eaecf0] px-2 py-1 rounded-md text-[#54595d]">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {userData.learningPath && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-[#54595d] mb-1">Learning path:</p>
                      <span className="text-xs bg-[#eaf3ff] text-[#3366cc] px-2 py-1 rounded-md">
                        {learningPaths.find(p => p.id === userData.learningPath)?.title || userData.learningPath}
                      </span>
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting || !canSubmit}
                  aria-disabled={isSubmitting || !canSubmit}
                  className="bg-[#3366cc] text-white py-2 px-6 rounded-sm hover:bg-[#2a4b8d] transition-colors font-medium flex items-center justify-center mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : "Begin Your Journey"}
                </button>
              </div>
            </div>
          )}
        </motion.div>

        <div className="flex justify-between mt-8">
          {step > 1 ? (
            <button 
              onClick={handleBack}
              className="px-4 py-2 border border-[#a2a9b1] text-[#202122] rounded-sm hover:bg-[#f8f9fa] transition-colors"
              disabled={isSubmitting}
              aria-disabled={isSubmitting}
            >
              Back
            </button>
          ) : <div></div>}
          
          {step < totalSteps && (
            <button 
              onClick={handleNext}
              className="px-4 py-2 bg-[#3366cc] text-white rounded-sm hover:bg-[#2a4b8d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={(step === 1 && !canProceedToStep2) || 
                      (step === 2 && !canProceedToStep3)}
              aria-disabled={(step === 1 && !canProceedToStep2) || 
                      (step === 2 && !canProceedToStep3)}
            >
              Continue
            </button>
          )}
        </div>
      </main>

      <footer className="max-w-2xl mx-auto mt-8 text-xs text-[#72777d] text-center">
        <p>
          This page follows Wikipedia's onboarding principles.
        </p>
      </footer>
    </div>
  );
};

export default OnboardingPage;