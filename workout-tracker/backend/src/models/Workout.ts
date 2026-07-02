import { Schema, model, type Document, type Types } from 'mongoose'

export interface IWorkout extends Document {
  user: Types.ObjectId
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

const workoutSchema = new Schema<IWorkout>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    exerciseType: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: Number,
      min: 1,
    },
    durationUnit: {
      type: String,
      enum: ['seconds', 'minutes'],
      default: 'minutes',
    },
    reps: {
      type: Number,
      min: 0,
    },
    sets: {
      type: Number,
      min: 0,
    },
    caloriesBurned: {
      type: Number,
      min: 0,
    },
    workoutDate: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
)

export const Workout = model<IWorkout>('Workout', workoutSchema)
