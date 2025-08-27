import { useState, useCallback } from 'react';
import { ChatMessage, SchemeData } from '../types';
import { chatWithAssistant, processPdf } from '../services/api';

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string, language: string = 'en', useGrounding: boolean = false) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response: SchemeData = await chatWithAssistant(content, language, useGrounding);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response.text_response,
        role: 'assistant',
        timestamp: new Date(),
        sources: response.sources,
        schemeData: response
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const uploadPdf = useCallback(async (file: File) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: `Uploaded PDF: ${file.name}`,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, this would call the actual API
      // For now, we'll simulate processing
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

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process PDF');
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error processing your PDF.',
        role: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    uploadPdf,
    clearMessages
  };
};