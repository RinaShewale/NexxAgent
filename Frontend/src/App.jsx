import React, { useState } from 'react';
import InteractiveLoadingPage from './components/Home/pages/InteractiveLoadingPage';
import HomePage from './components/Home/pages/HomePage';




export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="bg-[#FFF2E0] min-h-screen">
      {isLoading ? (
        <InteractiveLoadingPage 
          onComplete={() => setIsLoading(false)} 
        />
      ) : (
        <HomePage />
      )}
    </div>
  );
}