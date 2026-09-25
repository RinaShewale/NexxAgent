import React, { useState } from 'react';
import { ReactLenis } from 'lenis/react';
import AppRoute from './AppRouter';
import InteractiveLoadingPage from '../components/Home/Loading/InteractiveLoadingPage';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,        // Smooth deceleration factor (0.08 is silky smooth)
        duration: 1.2,     // Scroll duration in seconds
        smoothWheel: true, // Smooth scrolling on desktop trackpad/mouse
        wheelMultiplier: 1,// Standard desktop wheel speed
        touchMultiplier: 2,// Natural touch swipe multiplier
        syncTouch: false,  // CRITICAL: Keeps native 60–120Hz smooth touch physics on mobile
        infinite: false,
      }}
    >
      <div className="bg-[#FFF2E0] min-h-screen">
        {isLoading ? (
          <InteractiveLoadingPage onComplete={() => setIsLoading(false)} />
        ) : (
          <AppRoute />
        )}
      </div>
    </ReactLenis>
  );
}