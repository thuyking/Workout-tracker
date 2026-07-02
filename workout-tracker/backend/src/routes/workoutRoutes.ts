import { Router } from 'express'

import {
  addWorkout,
  editWorkout,
  getWorkout,
  getWorkoutProgressStats,
  listWorkouts,
  removeWorkout,
} from '../controllers/workoutController'
import { protect } from '../middlewares/authMiddleware'

const router = Router()

router.use(protect)

router.get('/', listWorkouts)
router.get('/:id/progress', getWorkoutProgressStats)
router.get('/:id', getWorkout)
router.post('/', addWorkout)
router.put('/:id', editWorkout)
router.delete('/:id', removeWorkout)

export default router
