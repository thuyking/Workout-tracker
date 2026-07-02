import { axiosClient } from '../../../shared/api/axiosClient'

export interface WorkoutPlanExercise {
  _id: string
  name: string
  reps?: number
  sets?: number
  holdSeconds?: number
  isCompleted: boolean
  workoutLog?: string
}

export interface WorkoutPlan {
  _id: string
  name: string
  planDate: string
  exercises: WorkoutPlanExercise[]
}

export interface WorkoutPlanExercisePayload {
  name: string
  reps?: number
  sets?: number
  holdSeconds?: number
  isCompleted?: boolean
  workoutLog?: string
}

export interface WorkoutPlanPayload {
  name: string
  planDate: string
  exercises: WorkoutPlanExercisePayload[]
}

export const getWorkoutPlans = async (date?: string): Promise<WorkoutPlan[]> => {
  const response = await axiosClient.get<WorkoutPlan[]>('/workout-plans', {
    params: date ? { date } : undefined,
  })

  return response.data
}

export const getWorkoutPlan = async (id: string): Promise<WorkoutPlan> => {
  const response = await axiosClient.get<WorkoutPlan>(`/workout-plans/${id}`)
  return response.data
}

export const createWorkoutPlan = async (
  payload: WorkoutPlanPayload,
): Promise<WorkoutPlan> => {
  const response = await axiosClient.post<WorkoutPlan>('/workout-plans', payload)
  return response.data
}

export const updateWorkoutPlan = async (
  id: string,
  payload: WorkoutPlanPayload,
): Promise<WorkoutPlan> => {
  const response = await axiosClient.put<WorkoutPlan>(`/workout-plans/${id}`, payload)
  return response.data
}

export const deleteWorkoutPlan = async (id: string): Promise<void> => {
  await axiosClient.delete(`/workout-plans/${id}`)
}

export const toggleWorkoutPlanExercise = async (
  planId: string,
  exerciseId: string,
): Promise<WorkoutPlan> => {
  const response = await axiosClient.patch<WorkoutPlan>(
    `/workout-plans/${planId}/exercises/${exerciseId}/toggle`,
  )

  return response.data
}
