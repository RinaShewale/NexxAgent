import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import AppShell from './components/layout/AppShell';
import InteractiveLoadingPage from './components/Loding/InteractiveLoadingPage'; // Ensure this path is correct

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading ? (
          // The Loader handles its own GSAP exit animation 
          // and calls onComplete when the curve finishes moving
          <InteractiveLoadingPage 
            key="loader" 
            onComplete={() => setIsLoading(false)} 
          />
        ) : (
          // Once loading is false, AppShell is rendered
          <AppShell key="shell" />
        )}
      </AnimatePresence>
    </>
  );
}