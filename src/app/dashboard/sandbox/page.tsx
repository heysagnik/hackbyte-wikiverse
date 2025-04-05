"use client";
import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Edit,
  Award,
  Book,
  HelpCircle,
  Plus,
  Check,
  // AlertTriangle, // Can remove if not used elsewhere
  MessageSquare,
  Send,
  Sparkles,
  RefreshCw
} from 'lucide-react';

// No API Key needed or handled in this file anymore!

const WikipediaEditorSandbox = () => {

  // Editable title and description
  const [articleTitle, setArticleTitle] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(true);
  const titlePlaceholder = "Enter Article Title";

  // Article content
  const [articleContent, setArticleContent] = useState(`= Your Article Title =

== Introduction ==
Add your introduction here.

== Main Section ==
Add your main content here.

=== Subsection ===
Add your subsection content here.

== References ==
<ref>Author, A. (2023). Title of source. Publisher. Retrieved from URL</ref>

== External Links ==
* [https://example.com Relevant Link]`);

  // Game mechanics
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [currentTask, setCurrentTask] = useState('Add a proper citation to the article');
  const [progress, setProgress] = useState(15);

  // AI feedback system (Keep analyze function for now, but it also needs conversion to use backend)
  // TODO: Convert analyzeWithGemini to also use a backend API route for security.
  const [showFeedback, setShowFeedback] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState('Analysis feature needs backend integration (TODO).'); // Placeholder

  // Chat with AI
  const [chatMessages, setChatMessages] = useState<{role: string, content: string}[]>([
    {role: 'system', content: 'Welcome to WikiLearn! Ask me anything about Wikipedia editing!'}
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Keep chat scrolled to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  // Update article content when title changes
  useEffect(() => {
    if (articleTitle) {
      setArticleContent(prevContent =>
         prevContent.replace(/^=.*?=/m, `= ${articleTitle} =`)
      );
    } else {
       setArticleContent(prevContent =>
         prevContent.replace(/^=.*?=/m, `= Your Article Title =`)
       );
    }
  }, [articleTitle]);

  // TODO: Convert this function to call a backend route like /api/analyze
  const analyzeWithGemini = async () => {
      setIsAnalyzing(true);
      setShowFeedback(true);
      setFeedback("Analyzing... (Note: This function still needs backend integration for security)");
      // Simulate delay for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      setFeedback("Analysis complete (Backend integration pending). Feature currently simulated.");
      // Add scoring logic if needed for the simulated version
      setScore(prev => prev + 5);
      setProgress(prev => Math.min(100, prev + 10));
      setIsAnalyzing(false);

      // --- Placeholder for actual backend call ---
      /*
      try {
          const response = await fetch('/api/analyze', { // Replace with your actual analyze API route
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ articleContent })
          });

          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          setFeedback(data.feedback); // Assuming your backend returns { feedback: "..." }

          // Update score/level/progress
          setScore(prevScore => {
             // ... scoring logic ...
          });

      } catch (error: any) {
          console.error("Error analyzing article:", error);
          setFeedback(`Error analyzing: ${error.message}`);
      } finally {
          setIsAnalyzing(false);
      }
      */
      // --- End Placeholder ---
  };


  // Chat with AI - NOW CALLS YOUR BACKEND /api/chat
  const handleSubmitMessage = async () => {
    const messageToSend = currentMessage.trim();
    if (!messageToSend || isSendingMessage) return;

    // Add user message optimistically
    const updatedChat = [...chatMessages, { role: 'user', content: messageToSend }];
    setChatMessages(updatedChat);
    setCurrentMessage('');
    setIsSendingMessage(true);

    try {
      // Call YOUR backend API route
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageToSend,
          articleContent: articleContent, // Send context to backend
        }),
      });

      // Check if the response from *your* backend is okay
      if (!response.ok) {
        // Try to get error message from your backend's JSON response
        const errorData = await response.json().catch(() => ({}));
        console.error("Error from /api/chat:", errorData);
        throw new Error(errorData.error || `Network error: ${response.statusText}`);
      }

      // Get the AI response from your backend's JSON
      const data = await response.json();

      if (data.response) {
        setChatMessages([
          ...updatedChat,
          { role: 'assistant', content: data.response } // Add AI response
        ]);
      } else {
        // Handle case where backend responded OK but didn't include expected data
         throw new Error("Received an empty response from the server.");
      }

    } catch (error: any) {
      console.error("Error sending chat message:", error);
      // Add an error message to the chat
      setChatMessages([
        ...updatedChat,
        { role: 'assistant', content: `Sorry, I couldn't get a response. Error: ${error.message}` }
      ]);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setArticleContent(e.target.value);
  };
  const handleTitleEdit = () => setIsEditingTitle(true);
  const handleTitleSave = () => setIsEditingTitle(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200">
         <div className="flex items-center justify-between px-4 py-2">
           <div className="flex items-center space-x-2">
             <Book className="w-6 h-6 text-blue-600" />
             <span className="font-bold text-xl text-blue-600">WikiLearn</span>
           </div>
           <div className="flex items-center space-x-4">
             {/* ... game stats ... */}
              <div className="flex items-center space-x-1">
               <Award className="w-5 h-5 text-yellow-500" />
               <span className="font-semibold">Level {level}</span>
             </div>
             <div className="flex items-center space-x-1">
               <div className="w-32 h-4 bg-gray-200 rounded-full overflow-hidden">
                 <div
                   className="h-full bg-green-500 rounded-full transition-all duration-300 ease-out"
                   style={{ width: `${progress}%` }}
                 ></div>
               </div>
               <span className="text-sm text-gray-600">{progress}%</span>
             </div>
             <div className="flex items-center space-x-1">
               <span className="font-semibold text-blue-500">{score} points</span>
             </div>
           </div>
         </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main Editor */}
        <div className="flex-1 flex flex-col">
           {/* ... tabs ... */}
            <div className="bg-white border-b border-gray-200">
             <div className="flex">
               <div className="px-4 py-2 font-medium text-blue-600 border-b-2 border-blue-600">Edit</div>
               <div className="px-4 py-2 text-gray-600 hover:text-blue-600 cursor-pointer">Talk</div>
               <div className="px-4 py-2 text-gray-600 hover:text-blue-600 cursor-pointer">History</div>
               <div className="px-4 py-2 text-gray-600 hover:text-blue-600 cursor-pointer">Preview</div>
             </div>
           </div>
           {/* Editor area */}
           <div className="flex-1 overflow-auto p-4">
             <div className="bg-white shadow rounded-lg p-4 mb-4">
               {/* ... title edit/display ... */}
               <div className="flex justify-between items-center mb-4">
                 {isEditingTitle ? (
                   <div className="flex items-center">
                     <input
                       type="text"
                       value={articleTitle}
                       onChange={(e) => setArticleTitle(e.target.value)}
                       className="text-xl font-bold border-b-2 border-blue-500 focus:outline-none"
                       placeholder={titlePlaceholder}
                       autoFocus
                     />
                     <button
                       onClick={handleTitleSave}
                       className="ml-2 text-blue-500 hover:text-blue-700"
                       title="Save Title"
                     >
                       <Check className="w-5 h-5" />
                     </button>
                   </div>
                 ) : (
                   <div className="flex items-center">
                     <h1 className="text-xl font-bold">Sandbox: {articleTitle || titlePlaceholder}</h1>
                     <button
                       onClick={handleTitleEdit}
                       className="ml-2 text-gray-400 hover:text-blue-500"
                       title="Edit Title"
                     >
                       <Edit className="w-4 h-4" />
                     </button>
                   </div>
                 )}
                 <div className="flex space-x-2">
                   <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm" disabled>
                     Save (WIP)
                   </button>
                   {/* Analyze button now points to the placeholder function */}
                   <button
                     className={`px-3 py-1 text-white rounded text-sm flex items-center transition-colors ${
                       isAnalyzing ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600' // Changed color to indicate WIP
                     }`}
                     onClick={analyzeWithGemini} // Still calls the placeholder analyze function
                     disabled={isAnalyzing}
                     title="Analyze article (Backend TODO)"
                   >
                     {isAnalyzing ? (
                       <>
                         <RefreshCw className="w-4 h-4 mr-1 animate-spin" /> Analyzing...
                       </>
                     ) : (
                       <>
                         <Sparkles className="w-4 h-4 mr-1" /> Analyze (WIP)
                       </>
                     )}
                   </button>
                 </div>
               </div>

               {/* ... toolbar and textarea ... */}
                <div className="border border-gray-300 rounded">
                 {/* Simplified Toolbar */}
                 <div className="bg-gray-100 border-b border-gray-300 p-2 flex justify-between">
                     <div className="flex space-x-1">
                         <button className="px-2 py-0.5 text-sm border border-gray-300 rounded bg-white hover:bg-gray-50">Bold</button>
                         <button className="px-2 py-0.5 text-sm border border-gray-300 rounded bg-white hover:bg-gray-50">Italic</button>
                         <button className="px-2 py-0.5 text-sm border border-gray-300 rounded bg-white hover:bg-gray-50">Link</button>
                         <button className="px-2 py-0.5 text-sm border border-gray-300 rounded bg-white hover:bg-gray-50">Cite</button>
                     </div>
                     <div>
                         <button className="px-2 py-0.5 text-sm border border-gray-300 rounded bg-white hover:bg-gray-50 flex items-center">
                         <HelpCircle className="w-4 h-4 mr-1" />
                         Help
                         </button>
                     </div>
                 </div>
                 <textarea
                   className="w-full p-4 min-h-[400px] focus:outline-none font-mono text-sm leading-relaxed"
                   value={articleContent}
                   onChange={handleContentChange}
                   placeholder="Start writing your Wikipedia article here using Wiki markup..."
                 />
               </div>
             </div>
           </div>
        </div>

        {/* Right Sidebar - AI Feedback & Chat */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          {/* Feedback Panel */}
          <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2 mb-3">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold">AI Feedback</h2>
            </div>
             {/* Feedback display */}
              {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <RefreshCw className="w-7 h-7 text-purple-500 animate-spin mb-3" />
                <p className="text-sm text-gray-600">Analyzing article (WIP)...</p>
              </div>
            ) : showFeedback ? (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                <div className="p-3 bg-yellow-50 rounded border-l-4 border-yellow-500"> {/* Changed color */}
                  <p className="text-sm whitespace-pre-line">{feedback}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <Sparkles className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="text-sm">Click "Analyze" to get AI feedback (Backend TODO).</p>
              </div>
            )}
          </div>

          {/* Chat Interface */}
          <div className="flex-1 flex flex-col overflow-hidden">
             {/* ... chat title ... */}
             <div className="p-3 bg-purple-50 border-b border-gray-200 flex items-center sticky top-0">
              <MessageSquare className="w-4 h-4 text-purple-600 mr-2 flex-shrink-0" />
              <h3 className="font-medium text-sm">Chat with AI Assistant</h3>
            </div>
             {/* ... chat messages display ... */}
             <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50/50">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] p-2 px-3 rounded-lg text-sm shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : msg.role === 'system' || msg.content.startsWith('Sorry,') // Style system/error messages
                        ? 'bg-gray-200 text-gray-700 border border-gray-300'
                        : 'bg-white text-gray-800 border border-gray-200' // Assistant
                    }`}
                    style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}
                  >
                    <span className={msg.role !== 'user' ? 'whitespace-pre-line' : ''}>{msg.content}</span>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-3 border-t border-gray-200 bg-white sticky bottom-0">
              <div className="flex space-x-2 items-center">
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => {if (e.key === 'Enter' && !isSendingMessage) {handleSubmitMessage()}}}
                  placeholder="Ask for editing help..." // No longer depends on key status here
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 disabled:bg-gray-100"
                  disabled={isSendingMessage} // Only disable while sending
                />
                <button
                  onClick={handleSubmitMessage}
                  className={`p-2 rounded-lg flex items-center justify-center ${
                    !isSendingMessage && currentMessage.trim()
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={isSendingMessage || !currentMessage.trim()}
                  title="Send message"
                >
                  {isSendingMessage ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WikipediaEditorSandbox;