import { type Types } from 'mongoose'

import { Workout, type IWorkout } from '../models/Workout'

export interface WorkoutInput {
  title: string
  exerciseType: string
  duration?: number
  durationUnit?: 'seconds' | 'minutes'
  reps?: number
  sets?: number
  caloriesBurned?: number
  workoutDate: Date
  notes?: string
}

export type WorkoutProgressRange = '7d' | '1m' | '1y'

export interface WorkoutProgressPoint {
  date: string
  value: number
}

export interface WorkoutMetricProgress {
  metric: 'duration' | 'volume'
  unit: NonNullable<IWorkout['durationUnit']> | 'total reps'
  entriesCount: number
  firstValue: number | null
  lastValue: number | null
  absoluteChange: number | null
  percentChange: number | null
  averageChangePerEntry: number | null
  averagePercentChangePerEntry: number | null
  direction: 'increase' | 'decrease' | 'stable' | 'not_enough_data'
  points: WorkoutProgressPoint[]
}

export interface WorkoutProgressResult {
  exerciseName: string
  range: WorkoutProgressRange
  durationProgress: WorkoutMetricProgress
  volumeProgress: WorkoutMetricProgress
}

export const getWorkouts = async (userId: string) => {
  return Workout.find({ user: userId }).sort({ workoutDate: -1 })
}

export const getWorkoutById = async (userId: string, workoutId: string) => {
  return Workout.findOne({ _id: workoutId, user: userId })
}

export const createWorkout = async (
  userId: string | Types.ObjectId,
  input: WorkoutInput,
) => {
  return Workout.create({
    ...input,
    user: userId,
  })
}

export const updateWorkout = async (
  userId: string,
  workoutId: string,
  input: Partial<WorkoutInput>,
) => {
  return Workout.findOneAndUpdate(
    { _id: workoutId, user: userId },
    input,
    { new: true, runValidators: true },
  )
}

export const deleteWorkout = async (userId: string, workoutId: string) => {
  return Workout.findOneAndDelete({ _id: workoutId, user: userId })
}

export const deleteWorkouts = async (userId: string, workoutIds: string[]) => {
  return Workout.deleteMany({
    _id: { $in: workoutIds },
    user: userId,
  })
}

const normalizeTitle = (title: string) => title.trim().replace(/\s+/g, ' ').toLowerCase()

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const getStartDate = (range: WorkoutProgressRange) => {
  const startDate = new Date()

  if (range === '7d') {
    startDate.setDate(startDate.getDate() - 7)
  }

  if (range === '1m') {
    startDate.setMonth(startDate.getMonth() - 1)
  }

  if (range === '1y') {
    startDate.setFullYear(startDate.getFullYear() - 1)
  }

  return startDate
}

const getAveragePercentChange = (values: number[]) => {
  const percentChanges = values.slice(1).reduce<number[]>((changes, value, index) => {
    const previousValue = values[index]

    if (previousValue === 0) {
      return changes
    }

    return [...changes, ((value - previousValue) / previousValue) * 100]
  }, [])

  if (percentChanges.length === 0) {
    return null
  }

  return percentChanges.reduce((sum, change) => sum + change, 0) / percentChanges.length
}

const calculateMetricProgress = (
  metric: WorkoutMetricProgress['metric'],
  unit: WorkoutMetricProgress['unit'],
  points: WorkoutProgressPoint[],
): WorkoutMetricProgress => {
  if (points.length < 2) {
    return {
      metric,
      unit,
      entriesCount: points.length,
      firstValue: points[0]?.value ?? null,
      lastValue: points[0]?.value ?? null,
      absoluteChange: null,
      percentChange: null,
      averageChangePerEntry: null,
      averagePercentChangePerEntry: null,
      direction: 'not_enough_data',
      points,
    }
  }

  const values = points.map((point) => point.value)
  const firstValue = values[0]
  const lastValue = values[values.length - 1]
  const absoluteChange = lastValue - firstValue
  const percentChange = firstValue === 0 ? null : (absoluteChange / firstValue) * 100
  const averageChangePerEntry = absoluteChange / (points.length - 1)

  return {
    metric,
    unit,
    entriesCount: points.length,
    firstValue,
    lastValue,
    absoluteChange,
    percentChange,
    averageChangePerEntry,
    averagePercentChangePerEntry: getAveragePercentChange(values),
    direction:
      absoluteChange > 0
        ? 'increase'
        : absoluteChange < 0
          ? 'decrease'
          : 'stable',
    points,
  }
}

export const getWorkoutProgress = async (
  userId: string,
  workoutId: string,
  range: WorkoutProgressRange,
): Promise<WorkoutProgressResult | null> => {
  const workout = await getWorkoutById(userId, workoutId)

  if (!workout) {
    return null
  }

  const durationUnit = workout.durationUnit ?? 'minutes'
  const titlePattern = normalizeTitle(workout.title)
    .split(' ')
    .map(escapeRegex)
    .join('\\s+')
  const titleRegex = new RegExp(`^${titlePattern}$`, 'i')
  const endDate = new Date()

  const workouts = await Workout.find({
    user: userId,
    title: titleRegex,
    workoutDate: { $gte: getStartDate(range), $lte: endDate },
  }).sort({ workoutDate: 1 })

  const durationPoints = workouts
    .filter(
      (item) =>
        typeof item.duration === 'number'
        && typeof item.sets === 'number'
        && (item.durationUnit ?? 'minutes') === durationUnit,
    )
    .map((item) => ({
      date: item.workoutDate.toISOString(),
      value: (item.duration as number) * (item.sets as number),
    }))

  const volumePoints = workouts
    .filter(
      (item) =>
        typeof item.reps === 'number'
        && typeof item.sets === 'number',
    )
    .map((item) => ({
      date: item.workoutDate.toISOString(),
      value: (item.reps as number) * (item.sets as number),
    }))

  return {
    exerciseName: workout.title,
    range,
    durationProgress: calculateMetricProgress('duration', durationUnit, durationPoints),
    volumeProgress: calculateMetricProgress('volume', 'total reps', volumePoints),
  }
}
