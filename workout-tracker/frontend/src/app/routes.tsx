import { createBrowserRouter } from 'react-router-dom'

import LoginPage from '../features/auth/pages/LoginPage'
import RegisterPage from '../features/auth/pages/RegisterPage'
import TodayPlanPage from '../features/plans/pages/TodayPlanPage'
import WorkoutPlansPage from '../features/plans/pages/WorkoutPlansPage'
import DashboardPage from '../features/workouts/pages/DashboardPage'
import WorkoutHistoryPage from '../features/workouts/pages/WorkoutHistoryPage'
import ProtectedRoute from './ProtectedRoute'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <DashboardPage />,
      },
      {
        path: '/workouts/new',
        element: <DashboardPage />,
      },
      {
        path: '/workouts/:id',
        element: <DashboardPage />,
      },
      {
        path: '/workouts/:id/edit',
        element: <DashboardPage />,
      },
      {
        path: '/workouts/:id/copy',
        element: <DashboardPage />,
      },
      {
        path: '/history',
        element: <WorkoutHistoryPage />,
      },
      {
        path: '/plans',
        element: <WorkoutPlansPage />,
      },
      {
        path: '/today',
        element: <TodayPlanPage />,
      },
    ],
  },
])
