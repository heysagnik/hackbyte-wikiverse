// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';

// IMPORTANT: Ensure the GEMINI_API_KEY is set in your .env.local file
const apiKey = process.env.GEMINI_API_KEY;
const API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText"; // Using PaLM 2 endpoint from your original code

export async function POST(request: NextRequest) {
  if (!apiKey) {
    console.error("API Key not found. Ensure GEMINI_API_KEY is set in .env.local");
    return NextResponse.json(
        { error: "API Key not configured on the server." },
        { status: 500 }
    );
  }

  try {
    // 1. Get the user message and article content from the request body
    const { message, articleContent } = await request.json();

    if (!message) {
        return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    // 2. Construct the prompt for the Google AI API
    const promptText = `You are a helpful Wikipedia editing assistant. The user is working on the following draft article:

<article_start>
${articleContent || "No article content provided."}
</article_end>

User: "${message}"

Provide a concise and helpful response related to Wikipedia editing best practices.`;

    // 3. Make the request to the Google Generative Language API
    const apiResponse = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey, // Use the secure API key from the server environment
      },
      body: JSON.stringify({
        prompt: {
          text: promptText,
        },
        temperature: 0.5,
        // Add other parameters like maxOutputTokens if needed
        // maxOutputTokens: 512,
      }),
    });

    // 4. Handle potential errors from the Google API
    if (!apiResponse.ok) {
      const errorData = await apiResponse.json().catch(() => ({})); // Try to get error details
      console.error(`Google API Error (${apiResponse.status}):`, errorData);
      return NextResponse.json(
          { error: `Google API Error: ${errorData?.error?.message || apiResponse.statusText}` },
          { status: apiResponse.status }
        );
    }

    // 5. Parse the successful response from Google
    const data = await apiResponse.json();

    // 6. Extract the AI's reply
    const aiResponse = data?.candidates?.[0]?.output;

    if (!aiResponse) {
        console.warn("Google API response missing expected output:", data);
        return NextResponse.json(
            { error: "AI response format was unexpected." },
            { status: 500 }
        );
    }

    // 7. Send the AI's response back to your frontend
    return NextResponse.json({ response: aiResponse.trim() });

  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    // Generic error for other issues (e.g., network error connecting to Google)
     return NextResponse.json(
        { error: `Internal Server Error: ${error.message || 'Unknown error'}` },
        { status: 500 }
    );
  }
}