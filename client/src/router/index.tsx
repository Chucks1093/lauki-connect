import { createBrowserRouter } from 'react-router';
import LandingPage from '../pages/LandingPage';
import DashboardPage from '../pages/DashboardPage';
import NewRequestPage from '../pages/NewRequestPage';
import MatchResultsPage from '../pages/MatchResultsPage';
import MatchDetailPage from '../pages/MatchDetailPage';

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/dashboard', element: <DashboardPage /> },
  { path: '/requests/new', element: <NewRequestPage /> },
  { path: '/requests/:requestId/matches', element: <MatchResultsPage /> },
  { path: '/matches/:matchId', element: <MatchDetailPage /> }
]);
