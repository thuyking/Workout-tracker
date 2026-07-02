import { Router } from 'express'

import {
  addWorkoutPlan,
  editWorkoutPlan,
  getWorkoutPlan,
  listWorkoutPlans,
  removeWorkoutPlan,
  toggleWorkoutPlanExerciseStatus,
} from '../controllers/workoutPlanController'
import { protect } from '../middlewares/authMiddleware'

const router = Router()

router.use(protect)

router.get('/', listWorkoutPlans)
router.get('/:id', getWorkoutPlan)
router.post('/', addWorkoutPlan)
router.put('/:id', editWorkoutPlan)
router.patch('/:id/exercises/:exerciseId/toggle', toggleWorkoutPlanExerciseStatus)
router.delete('/:id', removeWorkoutPlan)

export default router
