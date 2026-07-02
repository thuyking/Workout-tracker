import cors from 'cors'
import express from 'express'

import authRoutes from './routes/authRoutes'
import localeRoutes from './routes/localeRoutes'
import workoutPlanRoutes from './routes/workoutPlanRoutes'
import workoutRoutes from './routes/workoutRoutes'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/locales', localeRoutes)
app.use('/api/workout-plans', workoutPlanRoutes)
app.use('/api/workouts', workoutRoutes)

export default app
