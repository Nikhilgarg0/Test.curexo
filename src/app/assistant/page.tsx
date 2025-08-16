'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Bot, User, AlertCircle } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import Button from '@/components/ui/Button';
import useStore from '@/store/useStore';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: number;
}

const HealthAssistantPage = () => {
  const router = useRouter();
  const { user, isAuthenticated, setUser, healthMetrics } = useStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
    // Add initial greeting message if no messages exist
    if (messages.length === 0) {
      setMessages([
        {
          id: '1',
          text: `Hello ${user?.displayName?.split(' ')[0] || 'there'}! I'm your CUREXO health assistant. How can I help you today?`,
          sender: 'assistant',
          timestamp: Date.now(),
        },
      ]);
    }
  }, [user, messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response (in a real app, this would call an AI API)
    setTimeout(() => {
      const aiResponse = generateAIResponse(input, healthMetrics);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'assistant',
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Simple rule-based response generation (placeholder for actual AI)
  const generateAIResponse = (userInput: string, healthMetrics: any) => {
    const input = userInput.toLowerCase();

    if (input.includes('heart') || input.includes('pulse') || input.includes('bpm')) {
      return `Your current heart rate is ${healthMetrics.heartRate} bpm, which is within the normal range for most adults (60-100 bpm). Regular cardiovascular exercise can help maintain a healthy heart rate.`;
    }

    if (input.includes('steps') || input.includes('walking') || input.includes('activity')) {
      return `You've taken ${healthMetrics.steps} steps today. The recommended daily goal is 10,000 steps. Regular walking has numerous health benefits including improved cardiovascular fitness and weight management.`;
    }

    if (input.includes('sleep') || input.includes('rest') || input.includes('tired')) {
      return `You slept for ${healthMetrics.sleepHours} hours and ${healthMetrics.sleepMinutes} minutes last night. Adults typically need 7-9 hours of quality sleep per night. Consistent sleep patterns can improve overall health and cognitive function.`;
    }

    if (input.includes('health') && input.includes('score')) {
      return `Your current health score is ${healthMetrics.healthScore}/100. This score is calculated based on your activity levels, sleep patterns, heart rate, and other health metrics. Continue with your healthy habits to maintain or improve this score.`;
    }

    if (input.includes('medicine') || input.includes('medication') || input.includes('pill')) {
      return `I can help you track your medications and send reminders when it's time to take them. Would you like to add a new medication to your schedule or check your existing medications?`;
    }

    if (input.includes('appointment') || input.includes('doctor') || input.includes('visit')) {
      return `You can manage your doctor appointments in the Appointments section. Would you like me to help you schedule a new appointment or remind you about upcoming ones?`;
    }

    if (input.includes('emergency')) {
      return `In case of a medical emergency, please call emergency services immediately at 911. You can also access your emergency contacts in the Emergency section of the app.`;
    }

    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return `Hello! I'm your CUREXO health assistant. I can help you track your health metrics, manage medications, schedule appointments, and provide health information. How can I assist you today?`;
    }

    // Default response
    return `Thank you for your message. As your health assistant, I can help with tracking health metrics, medication reminders, appointment scheduling, and general health information. Could you please provide more details about what you'd like to know?`;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
        <div className="animate-pulse text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">AI Health Assistant</h1>
        <p className="text-white/70">Get personalized health guidance and information</p>
      </div>

      <GlassmorphicCard className="flex flex-col h-[calc(100vh-12rem)] mb-4">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`flex items-center justify-center h-8 w-8 rounded-full ${message.sender === 'user' ? 'bg-blue-500 ml-2' : 'bg-purple-500 mr-2'}`}
                >
                  {message.sender === 'user' ? (
                    <User size={16} className="text-white" />
                  ) : (
                    <Bot size={16} className="text-white" />
                  )}
                </div>
                <div
                  className={`p-3 rounded-lg ${message.sender === 'user' ? 'bg-blue-500/50 rounded-tr-none' : 'bg-white/10 rounded-tl-none'}`}
                >
                  <p className="text-white">{message.text}</p>
                  <p className="text-xs text-white/50 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex flex-row">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-500 mr-2">
                  <Bot size={16} className="text-white" />
                </div>
                <div className="p-3 rounded-lg bg-white/10 rounded-tl-none">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: '600ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your health question here..."
              className="flex-1 bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
              rows={1}
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="h-10 w-10 rounded-full p-0 flex items-center justify-center"
            >
              <Send size={16} />
            </Button>
          </div>
          <p className="text-xs text-white/50 mt-2">
            Note: This is a simulated AI assistant. In a production environment, this would connect to a real AI service.
          </p>
        </div>
      </GlassmorphicCard>

      <GlassmorphicCard className="p-4 mb-4">
        <div className="flex items-start gap-3">
          <AlertCircle size={20} className="text-yellow-400 mt-0.5" />
          <div>
            <h3 className="text-white font-medium">Health Disclaimer</h3>
            <p className="text-white/70 text-sm">
              The AI Health Assistant provides general information and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for medical concerns.
            </p>
          </div>
        </div>
      </GlassmorphicCard>
    </AppLayout>
  );
};

export default HealthAssistantPage;