import { type Types } from 'mongoose'

import { Workout } from '../models/Workout'
import { WorkoutPlan } from '../models/WorkoutPlan'

export interface WorkoutPlanExerciseInput {
  name: string
  reps?: number
  sets?: number
  holdSeconds?: number
  isCompleted?: boolean
  workoutLog?: Types.ObjectId
}

export interface WorkoutPlanInput {
  name: string
  planDate: Date
  exercises: WorkoutPlanExerciseInput[]
}

const getDateRange = (date: string) => {
  const startDate = new Date(`${date}T00:00:00.000Z`)
  const endDate = new Date(startDate)
  endDate.setUTCDate(endDate.getUTCDate() + 1)

  return { startDate, endDate }
}

const normalizeExercises = (exercises: WorkoutPlanExerciseInput[]) => {
  return exercises.map((exercise) => ({
    ...exercise,
    isCompleted: exercise.isCompleted ?? false,
  }))
}

const createWorkoutLogFromPlanExercise = async (
  userId: string,
  plan: Awaited<ReturnType<typeof getWorkoutPlanById>>,
  exercise: WorkoutPlanExerciseInput,
) => {
  if (!plan) {
    return null
  }

  return Workout.create({
    user: userId,
    title: exercise.name,
    exerciseType: plan.name,
    duration: exercise.holdSeconds && exercise.holdSeconds > 0
      ? exercise.holdSeconds
      : undefined,
    durationUnit: 'seconds',
    reps: exercise.reps,
    sets: exercise.sets,
    workoutDate: plan.planDate,
    notes: `Created from workout plan: ${plan.name}`,
  })
}

export const getWorkoutPlans = async (userId: string, date?: string) => {
  const query: Record<string, unknown> = { user: userId }

  if (date) {
    const { startDate, endDate } = getDateRange(date)
    query.planDate = { $gte: startDate, $lt: endDate }
  }

  return WorkoutPlan.find(query).sort({ planDate: -1, createdAt: -1 })
}

export const getWorkoutPlanById = async (userId: string, planId: string) => {
  return WorkoutPlan.findOne({ _id: planId, user: userId })
}

export const createWorkoutPlan = async (
  userId: string | Types.ObjectId,
  input: WorkoutPlanInput,
) => {
  return WorkoutPlan.create({
    ...input,
    exercises: normalizeExercises(input.exercises),
    user: userId,
  })
}

export const updateWorkoutPlan = async (
  userId: string,
  planId: string,
  input: Partial<WorkoutPlanInput>,
) => {
  return WorkoutPlan.findOneAndUpdate(
    { _id: planId, user: userId },
    {
      ...input,
      exercises: input.exercises
        ? normalizeExercises(input.exercises)
        : undefined,
    },
    { new: true, runValidators: true },
  )
}

export const deleteWorkoutPlan = async (userId: string, planId: string) => {
  return WorkoutPlan.findOneAndDelete({ _id: planId, user: userId })
}

export const toggleWorkoutPlanExercise = async (
  userId: string,
  planId: string,
  exerciseId: string,
) => {
  const plan = await getWorkoutPlanById(userId, planId)

  if (!plan) {
    return null
  }

  const exercise = plan.exercises.find(
    (item) => item._id?.toString() === exerciseId,
  )

  if (!exercise) {
    return null
  }

  if (exercise.isCompleted) {
    exercise.isCompleted = false

    if (exercise.workoutLog) {
      await Workout.findOneAndDelete({
        _id: exercise.workoutLog,
        user: userId,
      })
      exercise.workoutLog = undefined
    }
  } else {
    exercise.isCompleted = true

    const workoutLog = await createWorkoutLogFromPlanExercise(
      userId,
      plan,
      exercise,
    )

    exercise.workoutLog = workoutLog?._id
  }

  await plan.save()

  return plan
}
