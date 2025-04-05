import React from 'react';
import { AlertCircle, CheckCircle, XCircle, Info, X, Award, Search, FileText, BookOpen, Scale, Sparkles } from 'lucide-react';

interface AnalysisFeedbackProps {
  isOpen: boolean;
  onClose: () => void;
  feedback: string;
  isAnalyzing: boolean;
}

export function AnalysisFeedback({
  isOpen,
  onClose,
  feedback,
  isAnalyzing
}: AnalysisFeedbackProps) {
  if (!isOpen) return null;
  
  // Function to parse and structure feedback based on emoji headers
  const renderStructuredFeedback = () => {
    if (!feedback || feedback === "Analyzing your article...") {
      return null;
    }
    
    // Split by emoji headers (🏆, 🔍, etc.)
    const sections = feedback.split(/(?=🏆|🔍|📝|📚|⚖️|✨)/).filter(section => section.trim().length > 0);
    
    // Map emojis to icons and colors
    const emojiMap: Record<string, { icon: React.ReactNode; color: string; bgColor: string; title: string }> = {
      '🏆': { 
        icon: <Award className="w-5 h-5" />, 
        color: 'text-[#58CC02]', 
        bgColor: 'bg-[#E6F8E6] border-[#58CC02]',
        title: 'STRENGTHS'
      },
      '🔍': { 
        icon: <Search className="w-5 h-5" />, 
        color: 'text-[#FF9600]', 
        bgColor: 'bg-[#FFF0E5] border-[#FF9600]',
        title: 'AREAS TO IMPROVE'
      },
      '📝': { 
        icon: <FileText className="w-5 h-5" />, 
        color: 'text-[#1CB0F6]', 
        bgColor: 'bg-[#DDF4FF] border-[#1CB0F6]',
        title: 'STRUCTURE AND ORGANIZATION'
      },
      '📚': { 
        icon: <BookOpen className="w-5 h-5" />, 
        color: 'text-[#A560E8]', 
        bgColor: 'bg-[#F7E9FF] border-[#A560E8]',
        title: 'CITATIONS AND REFERENCES'
      },
      '⚖️': { 
        icon: <Scale className="w-5 h-5" />, 
        color: 'text-[#FF4B4B]', 
        bgColor: 'bg-[#FFE5E5] border-[#FF4B4B]',
        title: 'NEUTRALITY AND TONE'
      },
      '✨': { 
        icon: <Sparkles className="w-5 h-5" />, 
        color: 'text-[#FFB100]', 
        bgColor: 'bg-[#FFF4DC] border-[#FFB100]',
        title: 'SPECIFIC SUGGESTIONS'
      }
    };
    
    return (
      <div className="space-y-4">
        {sections.map((section, index) => {
          // Identify emoji at the start of the section
          const emojiMatch = section.match(/^(🏆|🔍|📝|📚|⚖️|✨)/);
          const emoji = emojiMatch ? emojiMatch[1] : null;
          const mappedEmoji = emoji ? emojiMap[emoji] : null;
          
          // Extract title and content
          const titleMatch = section.match(/^[^\w]*(.*?)[\n\r]/);
          const title = titleMatch ? titleMatch[1].trim() : section.split('\n')[0];
          const content = section.replace(/^.*?\n/, '').trim();
          
          // Format bullet points
          const formattedContent = content.split('\n').map((line, i) => {
            if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
              return (
                <li key={i} className="ml-2 mb-2 flex items-start">
                  <span className="mr-2 mt-0.5 h-1.5 w-1.5 rounded-full bg-current flex-shrink-0"></span>
                  <span>{line.replace(/^[-*]\s*/, '')}</span>
                </li>
              );
            }
            return <p key={i} className="mb-2">{line}</p>;
          });
          
          // Pick styling based on emoji or default to neutral
          const styling = mappedEmoji ? {
            icon: mappedEmoji.icon,
            color: mappedEmoji.color,
            bgColor: mappedEmoji.bgColor,
            title: mappedEmoji.title
          } : {
            icon: <Info className="w-5 h-5" />,
            color: 'text-[#1CB0F6]',
            bgColor: 'bg-[#F0F0F0] border-[#ADADAD]',
            title: title
          };
          
          return (
            <div 
              key={index} 
              className={`p-4 rounded-xl ${styling.bgColor} border-l-4`}
            >
              <div className="flex items-start">
                <div className={`flex-shrink-0 mr-3 ${styling.color}`}>
                  {styling.icon}
                </div>
                <div className="text-sm text-gray-700 flex-1">
                  <h4 className="font-bold mb-2">{styling.title}</h4>
                  <ul className="space-y-1">
                    {formattedContent}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Score section */}
        {feedback.includes('/10') && (
          <div className="mt-6 p-4 rounded-xl bg-[#F0F2FF] border-l-4 border-[#8B97F7]">
            <div className="text-center">
              <h4 className="text-lg font-bold text-[#4B4B4B]">Overall Score</h4>
              <div className="flex justify-center mt-2">
                {Array.from({ length: 10 }).map((_, i) => {
                  const scoreMatch = feedback.match(/(\d+(\.\d+)?)\s*\/\s*10/);
                  const score = scoreMatch ? Math.round(parseFloat(scoreMatch[1])) : 0;
                  return (
                    <div 
                      key={i} 
                      className={`h-4 w-6 mx-0.5 rounded-sm ${i < score ? 'bg-[#58CC02]' : 'bg-gray-200'}`}
                    ></div>
                  );
                })}
              </div>
              <p className="text-sm font-bold mt-2 text-[#4B4B4B]">
                {feedback.match(/(\d+(\.\d+)?)\s*\/\s*10/) ? feedback.match(/(\d+(\.\d+)?)\s*\/\s*10/)![0] : "Score not found"}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm bg-black/40 animate-fadeIn transition-all duration-300">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-xl animate-fadeIn">
        {/* Modal header */}
        <div className="bg-[#58CC02] text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Article Analysis</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[#46A302] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Modal content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-600">
              <div className="w-16 h-16 border-4 border-[#58CC02] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-lg font-medium">Analyzing your article...</p>
              <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-bold text-[#4B4B4B] mb-4">Feedback Summary</h3>
              {renderStructuredFeedback()}
            </div>
          )}
        </div>
        
        {/* Modal footer */}
        {!isAnalyzing && (
          <div className="border-t border-gray-200 p-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-2xl font-bold bg-[#58CC02] text-white hover:bg-[#46A302] transition-colors"
            >
              Got it!
            </button>
          </div>
        )}
      </div>
    </div>
  );
}