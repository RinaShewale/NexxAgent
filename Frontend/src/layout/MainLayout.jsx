import React from 'react';
import { useLocation } from 'react-router-dom';
import PageTransition from "../components/Home/Loading/PageTransition";
import Navbar from "../components/Home/components/Navbar";

const MainLayout = () => {
  const location = useLocation();

  // Paths where Navbar should NOT be visible
  const hiddenNavbarPaths = ['/shell', '/login'];

  // Check if current route starts with any of the hidden paths
  const shouldHideNavbar = hiddenNavbarPaths.some(path => 
    location.pathname.startsWith(path)
  );

  return (
    <div className="bg-[#FFF2E0] min-h-screen relative">
      {/* 
          If we are not in /shell, show Navbar. 
          The AppShell is fixed (z-100), so even if this renders for 
          a millisecond during transition, the AppShell will be on top.
      */}
      {!shouldHideNavbar && <Navbar />}
      
      <main>
        {/* PageTransition handles the <Outlet /> inside it */}
        <PageTransition />
      </main>
    </div>
  );
};

export default MainLayout;