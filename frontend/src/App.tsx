'use client';

import { useState, useRef, useEffect } from 'react';

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  sources?: Array<{ title: string; url: string; type: string }>;
  schemeData?: any;
}

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  const [useGrounding, setUseGrounding] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          language: language,
          use_grounding: useGrounding,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: data.text_response,
        role: 'assistant',
        timestamp: new Date(),
        sources: data.sources,
        schemeData: data
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }

    setIsLoading(true);
    
    try {
      // For demo purposes, we'll use a mock response
      // In production, you would upload the file to your backend
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        content: `Uploaded PDF: ${file.name}`,
        role: 'user',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: `I've processed your PDF document. Here's a summary of the scheme information I found...`,
        role: 'assistant',
        timestamp: new Date(),
        sources: [{ title: "Uploaded Document", url: "#", type: "document" }],
        schemeData: {
          scheme_name: "Scheme from PDF",
          issuer: "Government",
          eligibility_summary: "Extracted eligibility criteria from your document",
          benefits_summary: "Extracted benefits information from your document",
          sources: [{ title: "Uploaded PDF", url: "#", type: "document" }]
        }
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error processing PDF:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error processing your PDF.',
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatSchemeData = (data: any) => {
    if (!data) return null;
    
    return (
      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="font-semibold text-blue-800 mb-2">Scheme Details: {data.scheme_name}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <p className="text-sm"><span className="font-medium">Issuer:</span> {data.issuer}</p>
            <p className="text-sm"><span className="font-medium">State:</span> {data.state}</p>
            <p className="text-sm"><span className="font-medium">Categories:</span> {data.category?.join(', ')}</p>
          </div>
          
          <div>
            <p className="text-sm"><span className="font-medium">Confidence:</span> {(data.confidence * 100).toFixed(0)}%</p>
            <p className="text-sm"><span className="font-medium">Last Updated:</span> {data.last_checked}</p>
          </div>
        </div>
        
        <div className="mt-3">
          <h4 className="font-medium text-blue-700">Eligibility</h4>
          <p className="text-sm">{data.eligibility_summary}</p>
        </div>
        
        <div className="mt-3">
          <h4 className="font-medium text-blue-700">Benefits</h4>
          <p className="text-sm">{data.benefits_summary}</p>
        </div>
        
        {data.required_documents && data.required_documents.length > 0 && (
          <div className="mt-3">
            <h4 className="font-medium text-blue-700">Required Documents</h4>
            <ul className="text-sm list-disc list-inside">
              {data.required_documents.map((doc: string, index: number) => (
                <li key={index}>{doc}</li>
              ))}
            </ul>
          </div>
        )}
        
        {data.how_to_apply && (
          <div className="mt-3">
            <h4 className="font-medium text-blue-700">How to Apply</h4>
            <p className="text-sm"><span className="font-medium">Modes:</span> {data.how_to_apply.mode?.join(', ')}</p>
            {data.how_to_apply.steps && data.how_to_apply.steps.length > 0 && (
              <>
                <p className="text-sm font-medium mt-1">Steps:</p>
                <ol className="text-sm list-decimal list-inside">
                  {data.how_to_apply.steps.map((step: string, index: number) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </>
            )}
            {data.how_to_apply.deadline && (
              <p className="text-sm mt-1"><span className="font-medium">Deadline:</span> {data.how_to_apply.deadline}</p>
            )}
            {data.how_to_apply.official_portal && (
              <p className="text-sm mt-1">
                <span className="font-medium">Portal:</span>{' '}
                <a href={data.how_to_apply.official_portal} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {data.how_to_apply.official_portal}
                </a>
              </p>
            )}
          </div>
        )}
        
        {data.latest_updates && (
          <div className="mt-3">
            <h4 className="font-medium text-blue-700">Latest Updates</h4>
            <p className="text-sm">{data.latest_updates}</p>
          </div>
        )}
        
        <p className="text-xs text-gray-500 mt-3">{data.disclaimer}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-800">AI Scheme Assistant</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="grounding-toggle"
                checked={useGrounding}
                onChange={(e) => setUseGrounding(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="grounding-toggle" className="text-sm">
                Latest Updates
              </label>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-1 border rounded-md text-sm"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="bn">Bengali</option>
              <option value="ta">Tamil</option>
              <option value="te">Telugu</option>
              <option value="mr">Marathi</option>
            </select>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <h2 className="text-2xl font-semibold mb-4">Ask about government schemes</h2>
            <p className="mb-2">Example: "Which farmer schemes am I eligible for with income under 2 lakhs?"</p>
            <p className="mb-4">Or: "How do I apply for PM-KISAN as a small farmer?"</p>
            
            <div className="mt-6">
              <label className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-200">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handlePdfUpload}
                  className="hidden"
                />
                Upload Scheme PDF
              </label>
              <p className="text-xs mt-2 text-gray-400">Upload government circulars or scheme documents</p>
            </div>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3/4 rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              
              {message.schemeData && formatSchemeData(message.schemeData)}
              
              {message.sources && message.sources.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-500 mb-1">Sources:</p>
                  <div className="flex flex-wrap gap-1">
                    {message.sources.map((source, index) => (
                      <a
                        key={index}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded"
                      >
                        {source.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
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
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <footer className="bg-white border-t p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about government schemes..."
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </footer>
    </div>
  );
}