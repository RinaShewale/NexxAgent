import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Home/components/Navbar';

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <main>
        {/* This is where the child routes will render */}
        <Outlet />
      </main>
    </>
  );
};

export default MainLayout;