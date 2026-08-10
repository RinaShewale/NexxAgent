import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from '../layout/MainLayout'; // Import the new layout
import HomePage from '../components/Home/pages/HomePage'; // Import the HomePage component

// Placeholder components (Ideally these should also be in a /pages folder)
const Product = () => <div className="p-24">Product Page</div>;
const About = () => <div className="p-24">About Page</div>;
const WorkDetail = () => <div className="p-24">Work Detail Page</div>;

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