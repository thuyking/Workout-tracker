import type { Response } from 'express'

import type { AuthRequest } from '../middlewares/authMiddleware'
import {
  createWorkoutPlan,
  deleteWorkoutPlan,
  getWorkoutPlanById,
  getWorkoutPlans,
  toggleWorkoutPlanExercise,
  updateWorkoutPlan,
} from '../services/workoutPlanService'

const getUserId = (req: AuthRequest): string => {
  if (!req.userId) {
    throw new Error('User is not authenticated')
  }

  return req.userId
}

const getPlanId = (req: AuthRequest): string => {
  const planId = req.params.id

  if (!planId || Array.isArray(planId)) {
    throw new Error('Workout plan id is required')
  }

  return planId
}

const getExerciseId = (req: AuthRequest): string => {
  const exerciseId = req.params.exerciseId

  if (!exerciseId || Array.isArray(exerciseId)) {
    throw new Error('Workout plan exercise id is required')
  }

  return exerciseId
}

const hasValidExercises = (exercises: unknown): boolean => {
  return Array.isArray(exercises)
    && exercises.length > 0
    && exercises.every((exercise) => (
      exercise
      && typeof exercise === 'object'
      && 'name' in exercise
      && typeof exercise.name === 'string'
      && exercise.name.trim().length > 0
    ))
}

export const listWorkoutPlans = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const date = typeof req.query.date === 'string' ? req.query.date : undefined
    const plans = await getWorkoutPlans(getUserId(req), date)

    res.status(200).json(plans)
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Failed to get workout plans',
    })
  }
}

export const getWorkoutPlan = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const plan = await getWorkoutPlanById(getUserId(req), getPlanId(req))

    if (!plan) {
      res.status(404).json({ message: 'Workout plan not found' })
      return
    }

    res.status(200).json(plan)
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Failed to get workout plan',
    })
  }
}

export const addWorkoutPlan = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { name, planDate, exercises } = req.body

    if (!name || !planDate || !hasValidExercises(exercises)) {
      res.status(400).json({
        message: 'Name, plan date, and at least one exercise are required',
      })
      return
    }

    const plan = await createWorkoutPlan(getUserId(req), req.body)
    res.status(201).json(plan)
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : 'Failed to create workout plan',
    })
  }
}

export const editWorkoutPlan = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    if (req.body.exercises && !hasValidExercises(req.body.exercises)) {
      res.status(400).json({
        message: 'Workout plan must have at least one valid exercise',
      })
      return
    }

    const plan = await updateWorkoutPlan(getUserId(req), getPlanId(req), req.body)

    if (!plan) {
      res.status(404).json({ message: 'Workout plan not found' })
      return
    }

    res.status(200).json(plan)
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : 'Failed to update workout plan',
    })
  }
}

export const removeWorkoutPlan = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const plan = await deleteWorkoutPlan(getUserId(req), getPlanId(req))

    if (!plan) {
      res.status(404).json({ message: 'Workout plan not found' })
      return
    }

    res.status(200).json({ message: 'Workout plan deleted' })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Failed to delete workout plan',
    })
  }
}

export const toggleWorkoutPlanExerciseStatus = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const plan = await toggleWorkoutPlanExercise(
      getUserId(req),
      getPlanId(req),
      getExerciseId(req),
    )

    if (!plan) {
      res.status(404).json({ message: 'Workout plan or exercise not found' })
      return
    }

    res.status(200).json(plan)
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error
        ? error.message
        : 'Failed to update workout plan exercise',
    })
  }
}
