// src/layout/MainLayout.js (or wherever your MainLayout is located)
import React from 'react';
import { useLocation } from 'react-router-dom';
import PageTransition from "../components/Home/Loading/PageTransition";
import Navbar from "../components/Home/components/Navbar";

const MainLayout = () => {
  const location = useLocation();

  // 1. Define the list of paths where you DON'T want the Navbar to show
  const hiddenNavbarPaths = [
    '/shell',
    '/login',
   
    // You can add more here easily:
    // '/dashboard',
    // '/admin',
  ];

  // 2. Check if current path is in our list
  // .some and .startsWith ensures it works even if you have sub-pages like /shell/settings
  const shouldHideNavbar = hiddenNavbarPaths.some(path => 
    location.pathname.startsWith(path)
  );

  return (
    <div className="bg-[#FFF2E0] min-h-screen">
      {/* 3. Wrap Navbar in a condition */}
      {!shouldHideNavbar && <Navbar />}
      
      {/* 
        PageTransition remains here. 
        Because it wraps the <Outlet />, the animation 
        will still play when moving from "/" to "/shell"
      */}
      <PageTransition />
    </div>
  );
};

export default MainLayout;