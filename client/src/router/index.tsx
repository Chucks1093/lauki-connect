import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '../components/shared/AppShell.tsx';
import { DashboardPage } from '../pages/DashboardPage.tsx';
import { LandingPage } from '../pages/LandingPage.tsx';
import { MatchDetailPage } from '../pages/MatchDetailPage.tsx';
import { MatchResultsPage } from '../pages/MatchResultsPage.tsx';
import { NewRequestPage } from '../pages/NewRequestPage.tsx';

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
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'requests/new',
        element: <NewRequestPage />,
      },
      {
        path: 'requests/:requestId/results',
        element: <MatchResultsPage />,
      },
      {
        path: 'requests/:requestId/matches/:matchId',
        element: <MatchDetailPage />,
      },
      {
        path: 'results',
        element: <MatchResultsPage />,
      },
    ],
  },
]);

