"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageCircle, X, Sparkles, RefreshCw } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "model";
  parts: { text: string }[];
  timestamp?: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      parts: [
        {
          text: "Hi there! I'm the CampusServe assistant. How can I help you today?",
        },
      ],
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState<"default" | "dark" | "fun">("default");
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newUserMessage: Message = {
      role: "user",
      parts: [{ text: inputMessage }],
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await response.json();

      if (data.response) {
        setMessages((prev) => [
          ...prev,
          {
            role: "model",
            parts: [{ text: data.response }],
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          parts: [{ text: "Oops! Something went wrong. Let's try again!" }],
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getThemeClasses = () => {
    switch (theme) {
      case "dark":
        return {
          container: "bg-gradient-to-r from-gray-900 to-gray-800 text-white",
          header: "bg-gradient-to-r from-gray-800 to-black",
          userMessage: "bg-indigo-900 text-white",
          modelMessage: "bg-gray-700 text-gray-100",
        };
      case "fun":
        return {
          container: "bg-gradient-to-r from-pink-300 to-yellow-200 text-black",
          header: "bg-gradient-to-r from-pink-500 to-yellow-500",
          userMessage: "bg-purple-500 text-white",
          modelMessage: "bg-green-500 text-white",
        };
      default:
        return {
          container: "bg-gradient-to-r from-blue-50 to-white text-black",
          header:
            "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white",
          userMessage: "bg-indigo-100 text-gray-800",
          modelMessage: "bg-gray-200 text-gray-800",
        };
    }
  };

  const themeColors = getThemeClasses();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="flex items-center space-x-2"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(true)}
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-3 rounded-full shadow-2xl hover:from-indigo-600 hover:to-pink-600 transition-all md:p-3 sm:p-2"
            >
              <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed bottom-0 right-0 md:bottom-4 md:right-4 w-full h-[100vh] md:w-[450px] md:h-[600px] ${themeColors.container} rounded-none md:rounded-2xl shadow-2xl border-4 border-opacity-50 border-purple-300 flex flex-col overflow-hidden`}
          >
            <div
              className={`${themeColors.header} p-3 md:p-4 flex justify-between items-center`}
            >
              <div className="flex items-center space-x-2">
                <Sparkles className="text-yellow-300 w-4 h-4 md:w-6 md:h-6" />
                <h2 className="text-sm md:text-lg font-bold">
                  CampusServe Assistant
                </h2>
              </div>
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ rotate: 180, scale: 1.1 }}
                  onClick={() =>
                    setTheme((prev) =>
                      prev === "default"
                        ? "dark"
                        : prev === "dark"
                        ? "fun"
                        : "default"
                    )
                  }
                  className="hover:bg-purple-600 p-1 rounded-full"
                >
                  <RefreshCw className="w-4 h-4 md:w-5 md:h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-purple-600 p-1 rounded-full"
                >
                  <X className="w-4 h-4 md:w-5 md:h-5" />
                </motion.button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 md:p-4 space-y-3 custom-scrollbar">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: msg.role === "user" ? 50 : -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className={`flex flex-col ${
                    msg.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`p-2 md:p-3 rounded-2xl max-w-[90%] md:max-w-[80%] shadow-md ${
                      msg.role === "user"
                        ? themeColors.userMessage
                        : themeColors.modelMessage
                    }`}
                  >
                    <ReactMarkdown
                      components={{
                        a: ({ node, ...props }) => (
                          <a
                            {...props}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                          />
                        ),
                        code: ({ node, ...props }) => (
                          <code
                            {...props}
                            className="bg-gray-100 p-1 rounded text-sm"
                          />
                        ),
                      }}
                      className="text-sm md:text-base"
                    >
                      {msg.parts[0].text}
                    </ReactMarkdown>
                  </div>
                  <span className="text-xs text-gray-500 mt-1">
                    {msg.timestamp}
                  </span>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.5,
                    type: "spring",
                  }}
                  className="p-3 bg-gray-200 text-gray-800 rounded-2xl self-start"
                >
                  <div className="animate-pulse">Typing...</div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-2 md:p-4 border-t flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask about CampusServe..."
                className="flex-1 p-2 md:p-3 text-sm md:text-base border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSendMessage}
                disabled={isLoading}
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-2 md:p-3 rounded-xl hover:from-indigo-600 hover:to-pink-600 disabled:opacity-50 transition-all text-sm md:text-base"
              >
                <Send className="w-4 h-4 md:w-5 md:h-5" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
