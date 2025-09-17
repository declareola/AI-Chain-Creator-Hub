'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAccount } from 'wagmi';
import { CheckCircle, Circle, Wallet, Palette, ShoppingBag, TrendingUp, Sparkles } from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  completed: boolean;
}

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const { isConnected, address } = useAccount();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const steps: OnboardingStep[] = [
    {
      id: 'connect-wallet',
      title: 'Connect Your Wallet',
      description: 'Connect your MetaMask or WalletConnect wallet to get started with AI Chain Creator Hub.',
      icon: <Wallet className="h-6 w-6" />,
      completed: isConnected,
    },
    {
      id: 'explore-marketplace',
      title: 'Explore the Marketplace',
      description: 'Browse unique AI-generated NFTs created by talented artists in our marketplace.',
      icon: <ShoppingBag className="h-6 w-6" />,
      action: {
        label: 'Browse Marketplace',
        href: '/marketplace',
      },
      completed: completedSteps.has('explore-marketplace'),
    },
    {
      id: 'create-first-nft',
      title: 'Create Your First NFT',
      description: 'Use our AI-powered tools to generate and mint your own unique digital artwork.',
      icon: <Palette className="h-6 w-6" />,
      action: {
        label: 'Start Creating',
        href: '/create',
      },
      completed: completedSteps.has('create-first-nft'),
    },
    {
      id: 'setup-trading',
      title: 'Set Up Trading Strategies',
      description: 'Configure automated trading strategies to maximize your returns on VibeCoin.',
      icon: <TrendingUp className="h-6 w-6" />,
      action: {
        label: 'Trading Dashboard',
        href: '/dashboard',
      },
      completed: completedSteps.has('setup-trading'),
    },
    {
      id: 'join-community',
      title: 'Join the Community',
      description: 'Connect with other creators and collectors in our vibrant Web3 community.',
      icon: <Sparkles className="h-6 w-6" />,
      action: {
        label: 'Coming Soon',
      },
      completed: completedSteps.has('join-community'),
    },
  ];

  const completedCount = steps.filter(step => step.completed).length;
  const progressPercentage = (completedCount / steps.length) * 100;

  useEffect(() => {
    // Load completed steps from localStorage
    const saved = localStorage.getItem('onboarding-completed-steps');
    if (saved) {
      setCompletedSteps(new Set(JSON.parse(saved)));
    }
  }, []);

  useEffect(() => {
    // Save completed steps to localStorage
    localStorage.setItem('onboarding-completed-steps', JSON.stringify([...completedSteps]));
  }, [completedSteps]);

  const handleStepComplete = (stepId: string) => {
    setCompletedSteps(prev => new Set([...prev, stepId]));
  };

  const handleActionClick = (step: OnboardingStep) => {
    if (step.action?.onClick) {
      step.action.onClick();
    }
    handleStepComplete(step.id);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onClose();
    localStorage.setItem('onboarding-skipped', 'true');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Welcome to AI Chain Creator Hub!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Getting Started Progress</span>
              <span>{completedCount}/{steps.length} completed</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Current Step Highlight */}
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  {steps[currentStep].icon}
                </div>
                <div>
                  <CardTitle className="text-lg">{steps[currentStep].title}</CardTitle>
                  <CardDescription>{steps[currentStep].description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {steps[currentStep].action && (
                <Button
                  onClick={() => handleActionClick(steps[currentStep])}
                  className="w-full"
                  disabled={!steps[currentStep].completed && currentStep === 0 && !isConnected}
                >
                  {steps[currentStep].action.label}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* All Steps Overview */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Complete Your Journey</h3>
            <div className="grid gap-3">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    step.completed
                      ? 'bg-green-50 border-green-200'
                      : index === currentStep
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                  onClick={() => setCurrentStep(index)}
                >
                  <div className={`p-1 rounded-full ${
                    step.completed ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    {step.completed ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Circle className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${
                        step.completed ? 'text-green-800' : 'text-gray-900'
                      }`}>
                        {step.title}
                      </span>
                      {step.completed && (
                        <Badge variant="secondary" className="text-xs">
                          Completed
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                  <div className="text-gray-400">
                    {step.icon}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={handleSkip}>
              Skip Tutorial
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={currentStep === steps.length - 1}
              >
                Next
              </Button>
            </div>
          </div>

          {/* Completion Message */}
          {completedCount === steps.length && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    Congratulations! 🎉
                  </h3>
                  <p className="text-green-700 mb-4">
                    You've completed all the onboarding steps. You're now ready to explore everything AI Chain Creator Hub has to offer!
                  </p>
                  <Button onClick={onClose} className="bg-green-600 hover:bg-green-700">
                    Start Exploring
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
