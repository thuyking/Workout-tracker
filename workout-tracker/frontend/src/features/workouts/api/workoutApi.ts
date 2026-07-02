import { axiosClient } from '../../../shared/api/axiosClient'

export interface Workout {
  _id: string
  title: string
  exerciseType: string
  duration?: number
  durationUnit?: 'seconds' | 'minutes'
  reps?: number
  sets?: number
  caloriesBurned?: number
  workoutDate: string
  notes?: string
}

export type WorkoutPayload = Omit<Workout, '_id'>
export type WorkoutProgressRange = '7d' | '1m' | '1y'

export interface WorkoutProgressPoint {
  date: string
  value: number
}

export interface WorkoutMetricProgress {
  metric: 'duration' | 'volume'
  unit: NonNullable<Workout['durationUnit']> | 'total reps'
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

export interface WorkoutProgress {
  exerciseName: string
  range: WorkoutProgressRange
  durationProgress: WorkoutMetricProgress
  volumeProgress: WorkoutMetricProgress
}

export const getWorkouts = async (): Promise<Workout[]> => {
  const response = await axiosClient.get<Workout[]>('/workouts')
  return response.data
}

export const getWorkout = async (id: string): Promise<Workout> => {
  const response = await axiosClient.get<Workout>(`/workouts/${id}`)
  return response.data
}

export const getWorkoutProgress = async (
  id: string,
  range: WorkoutProgressRange,
): Promise<WorkoutProgress> => {
  const response = await axiosClient.get<WorkoutProgress>(
    `/workouts/${id}/progress`,
    { params: { range } },
  )
  return response.data
}

export const createWorkout = async (
  payload: WorkoutPayload,
): Promise<Workout> => {
  const response = await axiosClient.post<Workout>('/workouts', payload)
  return response.data
}

export const updateWorkout = async (
  id: string,
  payload: Partial<WorkoutPayload>,
): Promise<Workout> => {
  const response = await axiosClient.put<Workout>(`/workouts/${id}`, payload)
  return response.data
}

export const deleteWorkout = async (id: string): Promise<void> => {
  await axiosClient.delete(`/workouts/${id}`)
}

export const deleteWorkouts = async (ids: string[]): Promise<void> => {
  await axiosClient.delete('/workouts/bulk', {
    data: { ids },
  })
}
