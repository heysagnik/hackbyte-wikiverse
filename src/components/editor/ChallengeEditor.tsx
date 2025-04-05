import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, Info, Check, BookOpen, Star, AlertCircle, Award } from 'lucide-react';

interface ChallengeEditorProps {
  currentChallenge: {
    id: number;
    title: string;
    description: string;
    instructions: string;
  };
  articleContent: string;
  setArticleContent: (value: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  onReturnToGrid: () => void;
}

export function ChallengeEditor({
  currentChallenge,
  articleContent,
  setArticleContent,
  onAnalyze,
  isAnalyzing,
  onReturnToGrid,
}: ChallengeEditorProps) {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [tipVisible, setTipVisible] = useState(false);
  const [currentTip, setCurrentTip] = useState('');
  
  // Character count
  const charCount = articleContent.length;
  const minRecommendedChars = 500;
  const progress = Math.min(100, Math.round((charCount / minRecommendedChars) * 100));
  
  // Sample Wikipedia formatting tips
  const wikiTips = [
    "Use '=' symbols for headings: = Level 1 =, == Level 2 ==",
    "Citations use <ref> tags: <ref>Source details</ref>",
    "Create links with double brackets: [[Page name]]",
    "Add emphasis with '' (italic) or ''' (bold)",
    "Lists start with * for bullets or # for numbered items"
  ];
  
  // Show random tip
  const showRandomTip = () => {
    const randomTip = wikiTips[Math.floor(Math.random() * wikiTips.length)];
    setCurrentTip(randomTip);
    setTipVisible(true);
    setTimeout(() => setTipVisible(false), 5000);
  };
  
  // Insert formatting based on selected tool
  const handleToolClick = (tool: string) => {
    setActiveTool(tool);
    let insertion = '';
    let selectionStart = 0;
    let selectionEnd = 0;

    const textarea = document.getElementById('article-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    selectionStart = textarea.selectionStart;
    selectionEnd = textarea.selectionEnd;
    const selectedText = articleContent.substring(selectionStart, selectionEnd);

    switch (tool) {
      case 'bold':
        insertion = `'''${selectedText}'''`;
        break;
      case 'italic':
        insertion = `''${selectedText}''`;
        break;
      case 'heading':
        insertion = `== ${selectedText} ==`;
        break;
      case 'link':
        insertion = `[[${selectedText}]]`;
        break;
      case 'citation':
        insertion = `<ref>${selectedText}</ref>`;
        break;
      case 'list':
        insertion = `* ${selectedText}`;
        break;
      default:
        insertion = selectedText;
    }

    const newContent = 
      articleContent.substring(0, selectionStart) + 
      insertion + 
      articleContent.substring(selectionEnd);
      
    setArticleContent(newContent);
    
    // Reset active tool
    setTimeout(() => setActiveTool(null), 200);
    
    // Focus back on textarea
    textarea.focus();
  };

  return (
    <div className="flex flex-1 flex-col bg-[#F9F9F9]">
      {/* Header with back button and challenge info */}
      <div className="bg-[#58CC02] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <button 
              onClick={onReturnToGrid}
              className="flex items-center text-white rounded-full bg-[#46A302] hover:bg-[#3D8C01] transition-colors py-2 px-4"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              <span className="font-medium">Back</span>
            </button>
            
            <div className="text-center flex-1">
              <h1 className="text-xl font-bold">{currentChallenge.title}</h1>
              <div className="flex justify-center mt-1">
                <Award className="w-5 h-5 mr-1 text-yellow-300" />
                <span className="text-sm font-medium">Challenge #{currentChallenge.id}</span>
              </div>
            </div>
            
            <div className="w-[100px]">
              {/* Character count/progress indicator */}
              <div className="rounded-full overflow-hidden h-8 bg-[#46A302] relative">
                <div 
                  className="h-full bg-yellow-300 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                  {charCount}/{minRecommendedChars} chars
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main editor area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Info panel (responsive - hidden on small screens) */}
        <div className="hidden md:block w-72 bg-white shadow-md overflow-y-auto p-5 border-r-2 border-[#E5E5E5]">
          <div className="mb-6 bg-[#FFF4DC] p-4 rounded-xl border-l-4 border-[#FFD900]">
            <div className="flex items-center mb-2">
              <BookOpen className="w-5 h-5 text-[#FFB100] mr-2" />
              <h2 className="font-bold text-[#4B4B4B]">Challenge</h2>
            </div>
            <p className="text-sm text-gray-700">{currentChallenge.description}</p>
          </div>
          
          <div className="mb-6 bg-[#E6F8E6] p-4 rounded-xl border-l-4 border-[#58CC02]">
            <div className="flex items-center mb-2">
              <Check className="w-5 h-5 text-[#58CC02] mr-2" />
              <h2 className="font-bold text-[#4B4B4B]">Instructions</h2>
            </div>
            <p className="text-sm text-gray-700">{currentChallenge.instructions}</p>
          </div>
          
          <div className="mb-6">
            <button 
              onClick={() => setShowGuide(!showGuide)}
              className="w-full flex items-center justify-between text-sm px-4 py-3 rounded-xl bg-[#DDF4FF] text-[#1CB0F6] hover:bg-[#C7E9FB] transition-colors font-bold"
            >
              <span className="flex items-center">
                <HelpCircle className="w-4 h-4 mr-2" />
                Wikipedia Guidelines
              </span>
              <span>{showGuide ? '−' : '+'}</span>
            </button>
            
            {showGuide && (
              <div className="mt-3 text-sm text-gray-600 bg-[#F7FDFF] p-4 rounded-xl border border-[#C7E9FB]">
                <h3 className="font-bold text-[#1287B9] mb-2">Key Principles:</h3>
                <ul className="space-y-2">
                  {[
                    "Maintain a neutral point of view",
                    "Cite reliable sources",
                    "No original research",
                    "Be respectful of others",
                    "Use proper formatting"
                  ].map((principle, i) => (
                    <li key={i} className="flex items-start">
                      <div className="mr-2 mt-1 h-4 w-4 rounded-full bg-[#1CB0F6] flex items-center justify-center text-white text-xs">
                        <Check className="w-3 h-3" />
                      </div>
                      {principle}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <button
            onClick={showRandomTip}
            className="w-full text-sm px-4 py-3 rounded-xl bg-[#FFF0E5] text-[#FF9600] hover:bg-[#FFE4D1] transition-colors font-bold flex items-center justify-center"
          >
            <Star className="w-4 h-4 mr-2" />
            <span>Show Formatting Tip</span>
          </button>
        </div>
        
        {/* Editor + Submit panel */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Random tip toast notification */}
          {tipVisible && (
            <div className="absolute top-24 right-6 bg-[#FFF4DC] border-l-4 border-[#FFB100] p-4 rounded-xl shadow-lg max-w-md animate-fade-in-up z-10">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-[#FFB100]" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-[#976400] font-medium">{currentTip}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Editor */}
          <div className="flex-1 p-6">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-[#4B4B4B] mb-1">Wiki Article Editor</h2>
              <p className="text-sm text-gray-600">
                Format your article according to Wikipedia guidelines. Use the tools below to help structure your content.
              </p>
            </div>
            <div className="bg-white border-2 border-[#E5E5E5] rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-[#F7F7F7] border-b-2 border-[#E5E5E5] p-3 flex items-center space-x-2">
                {[
                  { id: 'bold', label: 'B', style: 'font-bold' },
                  { id: 'italic', label: 'I', style: 'italic' },
                  { id: 'heading', label: 'H', style: '' },
                  { id: 'link', label: 'Link', style: '' },
                  { id: 'citation', label: 'Cite', style: '' },
                  { id: 'list', label: 'List', style: '' }
                ].map((tool) => (
                  <button 
                    key={tool.id}
                    onClick={() => handleToolClick(tool.id)}
                    className={`px-3 py-2 rounded-lg ${
                      activeTool === tool.id 
                        ? 'bg-[#58CC02] text-white' 
                        : 'hover:bg-[#E5E5E5] text-[#4B4B4B]'
                    } font-medium transition-colors ${tool.style}`}
                  >
                    {tool.label}
                  </button>
                ))}
              </div>
              <textarea
                id="article-editor"
                className="w-full p-5 min-h-[450px] focus:outline-none font-mono text-sm leading-relaxed"
                value={articleContent}
                onChange={(e) => setArticleContent(e.target.value)}
                placeholder="= Sample Article Title =

== Introduction ==
Write an introduction here...

== Main Section ==
Expand on the topic here...

== References ==
<ref>Your citation here</ref>
"
              />
            </div>
            <div className="mt-6 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {charCount < minRecommendedChars ? (
                  <span className="text-orange-500">We recommend at least {minRecommendedChars} characters for a complete article</span>
                ) : (
                  <span className="text-[#58CC02]">Great work! Your article meets the recommended length.</span>
                )}
              </div>
              <button
                onClick={onAnalyze}
                disabled={isAnalyzing}
                className={`px-6 py-3 rounded-2xl font-bold text-white shadow-md transition-all ${
                  isAnalyzing 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-[#58CC02] hover:bg-[#46A302] hover:shadow-lg active:translate-y-0.5'
                }`}
              >
                {isAnalyzing ? 'Analyzing...' : 'Submit Article'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}