import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import HomePage from '../components/Home/pages/HomePage';
import About from '../components/Home/pages/About';
import LoginPage from '../components/auth/LoginPage';
import Community from '../components/Home/pages/Community';
import Pricing from '../components/Home/pages/Pricing';
import AppShell from '../components/Shells/AppShell';
import LandingPage from '../components/Shells/LandingPage';
import TemplateShowcase from '../components/Home/pages/TempleteShowcase';
import HistoryPage from '../components/Shells/HistoryPage';
import DeploymentPage from '../components/Shells/DeploymentPage';
import BeyondTheBrief from '../components/Home/pages/BeyondTheBrief';
import ArchitecturalArchives from '../components/Home/pages/ArchitecturalArchives';
import HowItWorks from '../components/Home/pages/HowItWorks';
import LearnByBuilding from '../components/Home/pages/LearnByBuilding';

// Import the ProtectedRoute wrapper
import ProtectedRoute from '../components/auth/ProtectedRoute';
import SettingsModal from '../components/features/SettingsModal';

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      // Public Pages
      { path: "/", element: <HomePage /> },
      { path: "/community", element: <Community /> },
      { path: "/websites", element: <TemplateShowcase /> },
      { path: "/about", element: <About /> },
      { path: "/pricing", element: <Pricing /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/explore", element: <BeyondTheBrief /> },
      { path: "/templete", element: <ArchitecturalArchives /> },
      { path: "/working", element: <HowItWorks /> },
      { path: "/learning", element: <LearnByBuilding /> },
       { path: "/settings", element: <SettingsModal /> },

      // Protected Pages (Require user to be logged in)
      { 
        path: "/dashboard", 
        element: (
          <ProtectedRoute>
            <LandingPage />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "/shell", 
        element: (
        
            <AppShell />
        ) 
      },
      { 
        path: "/history", 
        element: (
         
            <HistoryPage />

        ) 
      },
      {
        path: "/deployment",
        element: <DeploymentPage />,
      },
    ],
  },
]);

export default function AppRoute() {
  return <RouterProvider router={router} />;
}