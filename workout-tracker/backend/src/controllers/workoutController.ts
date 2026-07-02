import type { Response } from 'express'

import type { AuthRequest } from '../middlewares/authMiddleware'
import {
  createWorkout,
  deleteWorkout,
  deleteWorkouts,
  getWorkoutProgress,
  getWorkoutById,
  getWorkouts,
  updateWorkout,
  type WorkoutProgressRange,
} from '../services/workoutService'

const getUserId = (req: AuthRequest): string => {
  if (!req.userId) {
    throw new Error('User is not authenticated')
  }

  return req.userId
}

const getWorkoutId = (req: AuthRequest): string => {
  const workoutId = req.params.id

  if (!workoutId || Array.isArray(workoutId)) {
    throw new Error('Workout id is required')
  }

  return workoutId
}

export const listWorkouts = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const workouts = await getWorkouts(getUserId(req))
    res.status(200).json(workouts)
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Failed to get workouts',
    })
  }
}

export const getWorkout = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const workout = await getWorkoutById(getUserId(req), getWorkoutId(req))

    if (!workout) {
      res.status(404).json({ message: 'Workout not found' })
      return
    }

    res.status(200).json(workout)
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Failed to get workout',
    })
  }
}

export const getWorkoutProgressStats = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const range = req.query.range
    const validRanges: WorkoutProgressRange[] = ['7d', '1m', '1y']

    if (typeof range !== 'string' || !validRanges.includes(range as WorkoutProgressRange)) {
      res.status(400).json({ message: 'Range must be one of 7d, 1m, or 1y' })
      return
    }

    const progress = await getWorkoutProgress(
      getUserId(req),
      getWorkoutId(req),
      range as WorkoutProgressRange,
    )

    if (!progress) {
      res.status(404).json({ message: 'Workout not found' })
      return
    }

    res.status(200).json(progress)
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Failed to get workout progress',
    })
  }
}

export const addWorkout = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { title, exerciseType, workoutDate } = req.body

    if (!title || !exerciseType || !workoutDate) {
      res.status(400).json({
        message: 'Title, exercise type, and workout date are required',
      })
      return
    }

    const workout = await createWorkout(getUserId(req), req.body)
    res.status(201).json(workout)
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : 'Failed to create workout',
    })
  }
}

export const editWorkout = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const workout = await updateWorkout(getUserId(req), getWorkoutId(req), req.body)

    if (!workout) {
      res.status(404).json({ message: 'Workout not found' })
      return
    }

    res.status(200).json(workout)
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : 'Failed to update workout',
    })
  }
}

export const removeWorkout = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const workout = await deleteWorkout(getUserId(req), getWorkoutId(req))

    if (!workout) {
      res.status(404).json({ message: 'Workout not found' })
      return
    }

    res.status(200).json({ message: 'Workout deleted' })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Failed to delete workout',
    })
  }
}

export const removeWorkouts = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { ids } = req.body

    if (
      !Array.isArray(ids)
      || ids.length === 0
      || ids.some((id) => typeof id !== 'string' || id.trim() === '')
    ) {
      res.status(400).json({ message: 'Workout ids are required' })
      return
    }

    const result = await deleteWorkouts(getUserId(req), ids)

    res.status(200).json({
      message: 'Workouts deleted',
      deletedCount: result.deletedCount,
    })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Failed to delete workouts',
    })
  }
}
