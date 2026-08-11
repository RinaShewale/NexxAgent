import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from '../layout/MainLayout'; // Import the new layout
import HomePage from '../components/Home/pages/HomePage'; // Import the HomePage component
import Product from '../components/Home/pages/Product';
import About from '../components/Home/pages/About';
import WorkDetail from '../components/Home/pages/WorkDetail';



const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, // Use the layout component here
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/product", element: <Product /> },
      { path: "/about", element: <About /> },
      { path: "/work/:id", element: <WorkDetail /> },
    ],
  },
]);

export default function AppRoute() {
  return <RouterProvider router={router} />;
}