"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import * as Form from "@radix-ui/react-form";
import Image from "next/image";

const avatars = [
  { id: 1, src: "/avatars/avatar1.png", alt: "Editor avatar" },
  { id: 2, src: "/avatars/avatar2.png", alt: "Researcher avatar" },
  { id: 3, src: "/avatars/avatar3.png", alt: "Librarian avatar" },
  { id: 4, src: "/avatars/avatar4.png", alt: "Curator avatar" },
];

const learningPaths = [
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
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [userData, setUserData] = useState<{
    name: string;
    avatarId: number | null;
    learningPath: string | null;
  }>({
    name: "",
    avatarId: null,
    learningPath: null
  });

  const totalSteps = 3;

  React.useEffect(() => {
    // Calculate progress based on current step
    setProgress(((step - 1) / (totalSteps - 1)) * 100);
  }, [step]);

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
    setUserData({ ...userData, avatarId: id });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, name: e.target.value });
  };

  const handlePathSelect = (id: string) => {
    setUserData({ ...userData, learningPath: id });
  };

  const handleSubmit = () => {
    console.log("Onboarding complete with data:", userData);
    // Redirect to dashboard or next step
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#202122] py-8 px-4">
      {/* Header with Wikipedia styling */}
      <header className="max-w-4xl mx-auto mb-8">
        <h1 className="text-2xl font-serif text-[#162860] text-center mb-6">Welcome to Wikiverse</h1>
        
        {/* Progress bar */}
        <div className="w-full bg-[#eaecf0] rounded-full h-2.5">
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

      {/* Main content */}
      <main className="max-w-2xl mx-auto bg-white border border-[#c8ccd1] rounded-sm p-6 shadow-sm">
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
                <h2 className="text-xl font-medium text-[#202122] mb-2">Choose your avatar</h2>
                <p className="text-sm text-[#54595d]">Select an avatar that represents you in the Wikiverse community.</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
                {avatars.map((avatar) => (
                  <div 
                    key={avatar.id}
                    className={`border-2 rounded-lg p-2 cursor-pointer transition-all hover:bg-[#eaf3ff] ${
                      userData.avatarId === avatar.id ? 'border-[#3366cc] bg-[#eaf3ff]' : 'border-[#eaecf0]'
                    }`}
                    onClick={() => handleAvatarSelect(avatar.id)}
                  >
                    <div className="aspect-square relative">
                      {/* Replace with actual images when available */}
                      <div className="w-full h-full bg-[#f8f9fa] rounded flex items-center justify-center">
                        <span className="text-3xl">{avatar.alt.charAt(0)}</span>
                      </div>
                    </div>
                    <p className="text-xs text-center mt-2">{avatar.alt}</p>
                  </div>
                ))}
              </div>
              
              <Form.Root className="space-y-4">
                <Form.Field name="name">
                  <div className="flex flex-col space-y-1.5">
                    <Form.Label className="text-sm font-medium text-[#54595d]">Display Name</Form.Label>
                    <Form.Control asChild>
                      <input
                        className="w-full px-3 py-2 border border-[#a2a9b1] rounded-sm focus:outline-none focus:border-[#3366cc] focus:ring-1 focus:ring-[#3366cc]"
                        type="text"
                        required
                        placeholder="Enter your preferred display name"
                        value={userData.name}
                        onChange={handleNameChange}
                      />
                    </Form.Control>
                    <Form.Message className="text-sm text-[#d33]" match="valueMissing">
                      Please enter a display name
                    </Form.Message>
                  </div>
                </Form.Field>
              </Form.Root>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-medium text-[#202122] mb-2">Choose your learning path</h2>
                <p className="text-sm text-[#54595d]">Select how you'd like to learn about editing and contributing.</p>
              </div>
              
              <div className="space-y-4 my-6">
                {learningPaths.map((path) => (
                  <div 
                    key={path.id}
                    className={`border-2 rounded-md p-4 cursor-pointer transition-all hover:bg-[#eaf3ff] ${
                      userData.learningPath === path.id ? 'border-[#3366cc] bg-[#eaf3ff]' : 'border-[#eaecf0]'
                    }`}
                    onClick={() => handlePathSelect(path.id)}
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
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-[#3366cc]">
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                </svg>
              </div>
              
              <h2 className="text-xl font-medium text-[#202122]">You're all set!</h2>
              <p className="text-sm text-[#54595d] max-w-md mx-auto">
                Your profile has been created and your learning path is ready. 
                Click the button below to start your Wikipedia journey.
              </p>
              
              <div className="pt-4">
                <button 
                  onClick={handleSubmit}
                  className="bg-[#3366cc] text-white py-2 px-6 rounded-sm hover:bg-[#2a4b8d] transition-colors font-medium"
                >
                  Begin Your Journey
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8">
          {step > 1 ? (
            <button 
              onClick={handleBack}
              className="px-4 py-2 border border-[#a2a9b1] text-[#202122] rounded-sm hover:bg-[#f8f9fa] transition-colors"
            >
              Back
            </button>
          ) : <div></div>}
          
          {step < totalSteps && (
            <button 
              onClick={handleNext}
              className="px-4 py-2 bg-[#3366cc] text-white rounded-sm hover:bg-[#2a4b8d] transition-colors"
              disabled={(step === 1 && (!userData.avatarId || !userData.name)) || 
                      (step === 2 && !userData.learningPath)}
            >
              Continue
            </button>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-2xl mx-auto mt-8 text-xs text-[#72777d] text-center">
        <p>
          This page follows Wikipedia's onboarding principles. Last updated April 3, 2025.
        </p>
      </footer>
    </div>
  );
}