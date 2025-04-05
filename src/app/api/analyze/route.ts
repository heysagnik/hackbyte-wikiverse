import { NextRequest, NextResponse } from 'next/server';

const apiKey = process.env.GEMINI_API_KEY;
const API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent";

export async function POST(request: NextRequest) {
  if (!apiKey) {
    console.error("API Key not found. Ensure GEMINI_API_KEY is set in .env.local");
    return NextResponse.json(
      { error: "API Key not configured on the server." },
      { status: 500 }
    );
  }

  try {
    const { articleContent, articleTitle } = await request.json();

    if (!articleContent) {
      return NextResponse.json({ error: "Article content is required." }, { status: 400 });
    }

    const promptParts = [
      {
        text: `You are a Wikipedia editor assistant helping users improve their articles in the style of Duolingo.

Analyze this Wikipedia article draft and provide constructive feedback:

Title: ${articleTitle || "Untitled Article"}

${articleContent}

Provide feedback in these sections with emoji indicators:

1. 🏆 STRENGTHS (2-3 specific things done well)
2. 🔍 AREAS TO IMPROVE (2-3 specific issues)
3. 📝 STRUCTURE AND ORGANIZATION (Is it well-organized with proper sections?)
4. 📚 CITATIONS AND REFERENCES (Are there enough reliable sources?)
5. ⚖️ NEUTRALITY AND TONE (Is the writing neutral and unbiased?)
6. ✨ SPECIFIC SUGGESTIONS (3 actionable improvements)

Format each section clearly with headers and short, friendly bullet points.
End with a score out of 10 and a specific improvement task for the user to try next.
Use a friendly, encouraging tone like Duolingo - celebrate what they did well while offering constructive feedback.`
      }
    ];

    const requestBody = {
      contents: [
        {
          parts: promptParts
        }
      ],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 1024,
        topP: 0.95,
        topK: 40
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    const apiResponse = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify(requestBody),
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json().catch(() => ({}));
      console.error(`Google API Error (${apiResponse.status}):`, errorData);
      return NextResponse.json(
        { error: `Google API Error: ${errorData?.error?.message || apiResponse.statusText}` },
        { status: apiResponse.status }
      );
    }

    const data = await apiResponse.json();
    
    // Extract the text from the response based on Gemini API structure
    const analysisText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!analysisText) {
      console.error("Unexpected API response format:", JSON.stringify(data, null, 2));
      return NextResponse.json(
        { error: "AI analysis format was unexpected." },
        { status: 500 }
      );
    }

    // Extract score using regex (looking for a number out of 10)
    const scoreMatch = analysisText.match(/(\d+(\.\d+)?)\s*\/\s*10/);
    const score = scoreMatch ? parseFloat(scoreMatch[1]) : 5; // Default to 5 if not found
    
    // Extract a task if present - looking for the task at the end
    const taskRegex = /task[^\w]*([^\.]+)/i;
    const taskMatch = analysisText.match(taskRegex);
    const nextTask = taskMatch ? taskMatch[1].trim() : "Improve article structure";

    // Process the feedback into sections with special handling for Duolingo-style feedback
    const sections = analysisText
      .split(/(?=🏆|🔍|📝|📚|⚖️|✨)/)  // Split by emoji headers
      .map((section: string) => section.trim())
      .filter((section: string) => section.length > 0);

    return NextResponse.json({ 
      feedback: analysisText.trim(),
      sections: sections,
      score: score,
      nextTask: nextTask
    });

  } catch (error: any) {
    console.error("Error in /api/analyze:", error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}