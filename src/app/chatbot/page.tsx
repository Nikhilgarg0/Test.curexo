'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import useStore from '@/store/useStore';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import theme from '@/styles/theme';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatbotPage = () => {
  const router = useRouter();
  const { user, isAuthenticated, setUser } = useStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your CUREXO health assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (!user) {
        router.push('/auth/login');
      }
    });

    return () => unsubscribe();
  }, [router, setUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate AI response (in a real app, this would call your Langchain integration)
    setTimeout(() => {
      const botResponses = [
        "Based on your medical history, I recommend consulting with your doctor about this symptom.",
        "Your next medicine dose is scheduled in 2 hours.",
        "According to your health data, your blood pressure has been stable this week.",
        "I've found some information about that medication. Would you like to know about side effects or dosage?",
        "Remember to stay hydrated, especially with your current medication regimen."
      ];

      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];

      const botMessage: Message = {
        id: Date.now().toString(),
        text: randomResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-primary text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-180px)]">
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] p-3 rounded-lg ${message.sender === 'user' 
                  ? `bg-primary text-white` 
                  : `bg-white border border-gray-200`
                }`}
              >
                <div className="flex items-center mb-1">
                  <div 
                    className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${message.sender === 'user' 
                      ? `bg-white/20` 
                      : `bg-primary/10`
                    }`}
                  >
                    {message.sender === 'user' 
                      ? <User size={14} className="text-white" /> 
                      : <Bot size={14} color={theme.colors.primary} />
                    }
                  </div>
                  <span className={`text-xs ${message.sender === 'user' ? 'text-white/80' : 'text-gray-500'}`}>
                    {message.sender === 'user' ? 'You' : 'CUREXO Assistant'}
                  </span>
                  <span className={`text-xs ml-auto ${message.sender === 'user' ? 'text-white/60' : 'text-gray-400'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className={message.sender === 'user' ? 'text-white' : 'text-gray-800'}>
                  {message.text}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="p-3 bg-white border border-gray-200 rounded-lg flex items-center">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your health question here..."
            className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Button 
            onClick={handleSendMessage} 
            size="icon" 
            className="ml-2"
            disabled={inputValue.trim() === ''}
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default ChatbotPage;