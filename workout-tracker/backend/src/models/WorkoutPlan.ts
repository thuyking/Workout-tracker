import { Schema, model, type Document, type Types } from 'mongoose'

export interface IWorkoutPlanExercise {
  _id?: Types.ObjectId
  name: string
  reps?: number
  sets?: number
  holdSeconds?: number
  isCompleted: boolean
  workoutLog?: Types.ObjectId
}

export interface IWorkoutPlan extends Document {
  user: Types.ObjectId
  name: string
  planDate: Date
  exercises: IWorkoutPlanExercise[]
}

const workoutPlanExerciseSchema = new Schema<IWorkoutPlanExercise>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    reps: {
      type: Number,
      min: 0,
    },
    sets: {
      type: Number,
      min: 0,
    },
    holdSeconds: {
      type: Number,
      min: 0,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    workoutLog: {
      type: Schema.Types.ObjectId,
      ref: 'Workout',
    },
  },
  {
    _id: true,
  },
)

const workoutPlanSchema = new Schema<IWorkoutPlan>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    planDate: {
      type: Date,
      required: true,
    },
    exercises: {
      type: [workoutPlanExerciseSchema],
      default: [],
      validate: {
        validator: (exercises: IWorkoutPlanExercise[]) => exercises.length > 0,
        message: 'Workout plan must have at least one exercise',
      },
    },
  },
  {
    timestamps: true,
  },
)

export const WorkoutPlan = model<IWorkoutPlan>('WorkoutPlan', workoutPlanSchema)
