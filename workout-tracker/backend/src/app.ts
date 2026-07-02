import cors from 'cors'
import express from 'express'

import authRoutes from './routes/authRoutes'
import healthRoutes from './routes/healthRoutes'
import localeRoutes from './routes/localeRoutes'
import workoutPlanRoutes from './routes/workoutPlanRoutes'
import workoutRoutes from './routes/workoutRoutes'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'workout-tracker-backend',
    message: 'Backend is running. Use /api/health to check deployment status.',
  })
})

app.use('/api/health', healthRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/locales', localeRoutes)
app.use('/api/workout-plans', workoutPlanRoutes)
app.use('/api/workouts', workoutRoutes)

export default app
