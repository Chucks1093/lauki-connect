import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '../components/shared/AppShell.tsx';
import { DashboardPage } from '../pages/DashboardPage.tsx';
import { LandingPage } from '../pages/LandingPage.tsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: 'saved',
        element: <DashboardPage />,
      },
      {
        path: '*',
        element: <Navigate replace to="/" />,
      },
    ],
  },
]);
