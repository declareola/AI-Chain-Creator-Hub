'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { OnboardingModal } from './onboarding-modal';

export function OnboardingWrapper({ children }: { children: React.ReactNode }) {
  const { isConnected } = useAccount();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Check if user has already completed or skipped onboarding
    const hasCompletedOnboarding = localStorage.getItem('onboarding-completed-steps');
    const hasSkippedOnboarding = localStorage.getItem('onboarding-skipped');

    if (!hasCompletedOnboarding && !hasSkippedOnboarding) {
      // Show onboarding after a short delay to let the page load
      const timer = setTimeout(() => {
        setShowOnboarding(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
  };

  return (
    <>
      {children}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={handleCloseOnboarding}
      />
    </>
  );
}
