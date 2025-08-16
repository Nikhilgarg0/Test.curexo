'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ArrowRight, User, Calendar, Ruler, Weight, Droplet } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import theme from '@/styles/theme';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  fields: {
    name: string;
    label: string;
    type: string;
    placeholder: string;
    icon: React.ReactNode;
    required?: boolean;
  }[];
}

const OnboardingPage = () => {
  const router = useRouter();
  const { user, isAuthenticated, isNewUser, hasCompletedOnboarding, setHasCompletedOnboarding } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    height: '',
    weight: '',
    bloodType: '',
    allergies: '',
    chronicConditions: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    } else if (!isNewUser && hasCompletedOnboarding) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isNewUser, hasCompletedOnboarding, router]);

  const steps: OnboardingStep[] = [
    {
      id: 1,
      title: 'Personal Information',
      description: 'Let us know a bit about you',
      fields: [
        {
          name: 'fullName',
          label: 'Full Name',
          type: 'text',
          placeholder: 'Enter your full name',
          icon: <User size={18} />,
          required: true,
        },
        {
          name: 'dateOfBirth',
          label: 'Date of Birth',
          type: 'date',
          placeholder: 'Select your date of birth',
          icon: <Calendar size={18} />,
          required: true,
        },
      ],
    },
    {
      id: 2,
      title: 'Health Metrics',
      description: 'Basic health information to personalize your experience',
      fields: [
        {
          name: 'height',
          label: 'Height (cm)',
          type: 'number',
          placeholder: 'Enter your height in cm',
          icon: <Ruler size={18} />,
          required: true,
        },
        {
          name: 'weight',
          label: 'Weight (kg)',
          type: 'number',
          placeholder: 'Enter your weight in kg',
          icon: <Weight size={18} />,
          required: true,
        },
        {
          name: 'bloodType',
          label: 'Blood Type',
          type: 'text',
          placeholder: 'e.g., A+, B-, O+',
          icon: <Droplet size={18} />,
        },
      ],
    },
    {
      id: 3,
      title: 'Medical Information',
      description: 'Optional but helpful for better health recommendations',
      fields: [
        {
          name: 'allergies',
          label: 'Allergies',
          type: 'text',
          placeholder: 'List any allergies (or type "None")',
          icon: <User size={18} />,
        },
        {
          name: 'chronicConditions',
          label: 'Chronic Conditions',
          type: 'text',
          placeholder: 'List any chronic conditions (or type "None")',
          icon: <User size={18} />,
        },
      ],
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    // Validate required fields for current step
    const currentStepData = steps[currentStep];
    const requiredFields = currentStepData.fields.filter(field => field.required);
    
    const isValid = requiredFields.every(field => {
      const value = formData[field.name as keyof typeof formData];
      return value && value.trim() !== '';
    });

    if (!isValid) {
      alert('Please fill in all required fields');
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    // In a real app, we would save the user profile data to Firestore here
    console.log('Onboarding completed with data:', formData);
    
    // Mark onboarding as completed
    await setHasCompletedOnboarding(true);
    
    // Redirect to dashboard
    router.push('/dashboard');
  };

  if (!isAuthenticated || (!isNewUser && hasCompletedOnboarding)) {
    return null; // Will redirect in useEffect
  }

  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="py-6 px-4 bg-white shadow-sm">
        <h1 className="text-xl font-bold tracking-tight" style={{ color: theme.colors.primary }}>CUREXO</h1>
        <p className="text-sm" style={{ color: theme.colors.text.secondary }}>Welcome to your health journey</p>
      </div>
      
      <div className="flex-1 container mx-auto px-4 py-8 max-w-md">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            {steps.map((step, index) => (
              <div 
                key={step.id} 
                className="flex flex-col items-center"
              >
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${index <= currentStep ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}
                >
                  {index < currentStep ? (
                    <Check size={16} />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div 
                    className={`h-1 w-16 mt-3 ${index < currentStep ? 'bg-indigo-600' : 'bg-gray-200'}`}
                    style={{ marginLeft: '32px' }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-1">{currentStepData.title}</h2>
          <p className="text-gray-500 mb-6">{currentStepData.description}</p>
          
          <div className="space-y-4">
            {currentStepData.fields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium mb-1">
                  {field.label} {field.required && <span className="text-rose-500">*</span>}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    {field.icon}
                  </div>
                  <Input
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name as keyof typeof formData]}
                    onChange={handleInputChange}
                    className="pl-10"
                    required={field.required}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between">
          {currentStep > 0 ? (
            <Button 
              variant="ghost" 
              onClick={handleBack}
            >
              Back
            </Button>
          ) : (
            <div></div> // Empty div to maintain layout
          )}
          
          <Button 
            onClick={handleNext}
            className="flex items-center"
          >
            {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;