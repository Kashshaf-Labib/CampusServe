// src/components/ChatbotProvider.tsx
"use client";

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the chatbot to ensure it's only loaded on the client side
const GeminiChatbot = dynamic(() => import('./Chatbot'), { 
  ssr: false 
});

export default function ChatbotProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <>
      {children}
      <GeminiChatbot />
    </>
  );
}