import React, { useState } from 'react';
import Header from './components/Header';
import ChatMessage from './components/ChatMessage';
import MessageInput from './components/MessageInput';
import { useChat } from './hooks/useChat';
import { FileText, Lightbulb } from 'lucide-react';
import './App.css';

function App() {
  const [language, setLanguage] = useState('en');
  const [useGrounding, setUseGrounding] = useState(false);
  const { messages, isLoading, error, sendMessage, uploadPdf, clearMessages } = useChat();

  const handleSendMessage = (message: string) => {
    sendMessage(message, language, useGrounding);
  };

  const examples = [
    "Which farmer schemes am I eligible for with income under 2 lakhs?",
    "How do I apply for PM-KISAN as a small farmer?",
    "What healthcare schemes are available for senior citizens?",
    "Tell me about education scholarships for girls"
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        language={language}
        onLanguageChange={setLanguage}
        useGrounding={useGrounding}
        onUseGroundingChange={setUseGrounding}
      />
      
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="flex justify-center mb-6">
              <FileText className="w-16 h-16 text-blue-400" />
            </div>
            
            <h2 className="text-2xl font-semibold mb-4">Ask about government schemes</h2>
            
            <div className="max-w-2xl mx-auto mb-8">
              <h3 className="font-medium text-gray-600 mb-3 flex items-center justify-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Try asking about:
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {examples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(example)}
                    className="bg-white border border-gray-200 rounded-lg p-3 text-sm text-left hover:bg-gray-50 transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
            
            <p className="text-sm text-gray-400">
              Or upload a government circular PDF to get a summary
            </p>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {messages.length > 0 && (
              <div className="mt-4 text-center">
                <button
                  onClick={clearMessages}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Clear conversation
                </button>
              </div>
            )}
          </>
        )}
      </div>
      
      <MessageInput
        onSendMessage={handleSendMessage}
        onUploadPdf={uploadPdf}
        isLoading={isLoading}
      />
    </div>
  );
}

export default App;