"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkoutPlan = void 0;
const mongoose_1 = require("mongoose");
const workoutPlanExerciseSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Workout',
    },
}, {
    _id: true,
});
const workoutPlanSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
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
            validator: (exercises) => exercises.length > 0,
            message: 'Workout plan must have at least one exercise',
        },
    },
}, {
    timestamps: true,
});
exports.WorkoutPlan = (0, mongoose_1.model)('WorkoutPlan', workoutPlanSchema);
