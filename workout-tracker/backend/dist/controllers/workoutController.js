"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeWorkouts = exports.removeWorkout = exports.editWorkout = exports.addWorkout = exports.getWorkoutProgressStats = exports.getWorkout = exports.listWorkouts = void 0;
const workoutService_1 = require("../services/workoutService");
const getUserId = (req) => {
    if (!req.userId) {
        throw new Error('User is not authenticated');
    }
    return req.userId;
};
const getWorkoutId = (req) => {
    const workoutId = req.params.id;
    if (!workoutId || Array.isArray(workoutId)) {
        throw new Error('Workout id is required');
    }
    return workoutId;
};
const listWorkouts = async (req, res) => {
    try {
        const workouts = await (0, workoutService_1.getWorkouts)(getUserId(req));
        res.status(200).json(workouts);
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : 'Failed to get workouts',
        });
    }
};
exports.listWorkouts = listWorkouts;
const getWorkout = async (req, res) => {
    try {
        const workout = await (0, workoutService_1.getWorkoutById)(getUserId(req), getWorkoutId(req));
        if (!workout) {
            res.status(404).json({ message: 'Workout not found' });
            return;
        }
        res.status(200).json(workout);
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : 'Failed to get workout',
        });
    }
};
exports.getWorkout = getWorkout;
const getWorkoutProgressStats = async (req, res) => {
    try {
        const range = req.query.range;
        const validRanges = ['7d', '1m', '1y'];
        if (typeof range !== 'string' || !validRanges.includes(range)) {
            res.status(400).json({ message: 'Range must be one of 7d, 1m, or 1y' });
            return;
        }
        const progress = await (0, workoutService_1.getWorkoutProgress)(getUserId(req), getWorkoutId(req), range);
        if (!progress) {
            res.status(404).json({ message: 'Workout not found' });
            return;
        }
        res.status(200).json(progress);
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : 'Failed to get workout progress',
        });
    }
};
exports.getWorkoutProgressStats = getWorkoutProgressStats;
const addWorkout = async (req, res) => {
    try {
        const { title, exerciseType, workoutDate } = req.body;
        if (!title || !exerciseType || !workoutDate) {
            res.status(400).json({
                message: 'Title, exercise type, and workout date are required',
            });
            return;
        }
        const workout = await (0, workoutService_1.createWorkout)(getUserId(req), req.body);
        res.status(201).json(workout);
    }
    catch (error) {
        res.status(400).json({
            message: error instanceof Error ? error.message : 'Failed to create workout',
        });
    }
};
exports.addWorkout = addWorkout;
const editWorkout = async (req, res) => {
    try {
        const workout = await (0, workoutService_1.updateWorkout)(getUserId(req), getWorkoutId(req), req.body);
        if (!workout) {
            res.status(404).json({ message: 'Workout not found' });
            return;
        }
        res.status(200).json(workout);
    }
    catch (error) {
        res.status(400).json({
            message: error instanceof Error ? error.message : 'Failed to update workout',
        });
    }
};
exports.editWorkout = editWorkout;
const removeWorkout = async (req, res) => {
    try {
        const workout = await (0, workoutService_1.deleteWorkout)(getUserId(req), getWorkoutId(req));
        if (!workout) {
            res.status(404).json({ message: 'Workout not found' });
            return;
        }
        res.status(200).json({ message: 'Workout deleted' });
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : 'Failed to delete workout',
        });
    }
};
exports.removeWorkout = removeWorkout;
const removeWorkouts = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids)
            || ids.length === 0
            || ids.some((id) => typeof id !== 'string' || id.trim() === '')) {
            res.status(400).json({ message: 'Workout ids are required' });
            return;
        }
        const result = await (0, workoutService_1.deleteWorkouts)(getUserId(req), ids);
        res.status(200).json({
            message: 'Workouts deleted',
            deletedCount: result.deletedCount,
        });
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : 'Failed to delete workouts',
        });
    }
};
exports.removeWorkouts = removeWorkouts;
