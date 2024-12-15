// // src/app/api/chat/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { GoogleGenerativeAI } from "@google/generative-ai";

// // Ensure the API key is set in your .env file
// const apiKey = process.env.GEMINI_API_KEY;

// if (!apiKey) {
//   throw new Error("Missing GEMINI_API_KEY environment variable");
// }

// const genAI = new GoogleGenerativeAI(apiKey);
// const model = genAI.getGenerativeModel({ 
//   model: "gemini-1.5-pro", 
//   systemInstruction: `Context:
// CampusServe is a web application designed to streamline and automate the operations of the University Central Departmental Store (CDS), which functions as both a departmental store and a mini-restaurant. The platform enables food ordering, token-based meal pickup, dorm-specific delivery, and real-time order notifications for students, teachers, and staff. The application aims to improve operational efficiency and convenience, particularly for female dorm residents with restricted mobility after 6 pm.

// Tone and Style:
// Use a friendly and professional tone suitable for a university environment.
// Provide concise and actionable responses to ensure clarity.
// When necessary, suggest step-by-step instructions for complex processes like ordering food or viewing notifications.`
// });

// const generationConfig = {
//   temperature: 1,
//   topP: 0.95,
//   topK: 40,
//   maxOutputTokens: 8192,
// };

// export async function POST(request: NextRequest) {
//   try {
//     const { messages } = await request.json();

//     // Start a chat session
//     const chatSession = model.startChat({
//       generationConfig,
//       history: messages.slice(0, -1), // Use previous messages as context
//     });

//     // Send the last message
//     const lastMessage = messages[messages.length - 1];
//     const result = await chatSession.sendMessage(lastMessage.parts[0].text);

//     return NextResponse.json({
//       response: result.response.text()
//     });
//   } catch (error) {
//     console.error('Chatbot API Error:', error);
//     return NextResponse.json({ 
//       error: 'Failed to process chat request' 
//     }, { status: 500 });
//   }
// }

// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure the API key is set in your .env file
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("Missing GEMINI_API_KEY environment variable");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-pro", 
  systemInstruction: `Context:
CampusServe is a web application designed to streamline and automate the operations of the University Central Departmental Store (CDS), which functions as both a departmental store and a mini-restaurant. The platform enables food ordering, token-based meal pickup, dorm-specific delivery, and real-time order notifications for students, teachers, and staff. The application aims to improve operational efficiency and convenience, particularly for female dorm residents with restricted mobility after 6 pm.

Tone and Style:
Use a friendly and professional tone suitable for a university environment.
Provide concise and actionable responses to ensure clarity.
When necessary, suggest step-by-step instructions for complex processes like ordering food or viewing notifications.`
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
};

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    // Ensure the first message has the correct structure for Gemini
    const formattedHistory = messages.map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.parts[0].text }]
    }));

    // Start a chat session
    const chatSession = model.startChat({
      generationConfig,
      history: formattedHistory.slice(0, -1), // Use previous messages as context
    });

    // Send the last message
    const lastMessage = formattedHistory[formattedHistory.length - 1];
    const result = await chatSession.sendMessage(lastMessage.parts[0].text);

    return NextResponse.json({
      response: result.response.text()
    });
  } catch (error) {
    console.error('Chatbot API Error:', error);
    return NextResponse.json({ 
      error: 'Failed to process chat request' 
    }, { status: 500 });
  }
}

