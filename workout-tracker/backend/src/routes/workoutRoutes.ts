import { Router } from 'express'

import {
  addWorkout,
  editWorkout,
  getWorkout,
  getWorkoutProgressStats,
  listWorkouts,
  removeWorkout,
  removeWorkouts,
} from '../controllers/workoutController'
import { protect } from '../middlewares/authMiddleware'

const router = Router()

router.use(protect)

router.get('/', listWorkouts)
router.get('/:id/progress', getWorkoutProgressStats)
router.get('/:id', getWorkout)
router.post('/', addWorkout)
router.put('/:id', editWorkout)
router.delete('/bulk', removeWorkouts)
router.delete('/:id', removeWorkout)

export default router
