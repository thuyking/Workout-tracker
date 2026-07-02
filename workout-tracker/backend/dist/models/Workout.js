"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Workout = void 0;
const mongoose_1 = require("mongoose");
const workoutSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
});
exports.Workout = (0, mongoose_1.model)('Workout', workoutSchema);
