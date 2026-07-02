"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleWorkoutPlanExerciseStatus = exports.removeWorkoutPlan = exports.editWorkoutPlan = exports.addWorkoutPlan = exports.getWorkoutPlan = exports.listWorkoutPlans = void 0;
const workoutPlanService_1 = require("../services/workoutPlanService");
const getUserId = (req) => {
    if (!req.userId) {
        throw new Error('User is not authenticated');
    }
    return req.userId;
};
const getPlanId = (req) => {
    const planId = req.params.id;
    if (!planId || Array.isArray(planId)) {
        throw new Error('Workout plan id is required');
    }
    return planId;
};
const getExerciseId = (req) => {
    const exerciseId = req.params.exerciseId;
    if (!exerciseId || Array.isArray(exerciseId)) {
        throw new Error('Workout plan exercise id is required');
    }
    return exerciseId;
};
const hasValidExercises = (exercises) => {
    return Array.isArray(exercises)
        && exercises.length > 0
        && exercises.every((exercise) => (exercise
            && typeof exercise === 'object'
            && 'name' in exercise
            && typeof exercise.name === 'string'
            && exercise.name.trim().length > 0));
};
const listWorkoutPlans = async (req, res) => {
    try {
        const date = typeof req.query.date === 'string' ? req.query.date : undefined;
        const plans = await (0, workoutPlanService_1.getWorkoutPlans)(getUserId(req), date);
        res.status(200).json(plans);
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : 'Failed to get workout plans',
        });
    }
};
exports.listWorkoutPlans = listWorkoutPlans;
const getWorkoutPlan = async (req, res) => {
    try {
        const plan = await (0, workoutPlanService_1.getWorkoutPlanById)(getUserId(req), getPlanId(req));
        if (!plan) {
            res.status(404).json({ message: 'Workout plan not found' });
            return;
        }
        res.status(200).json(plan);
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : 'Failed to get workout plan',
        });
    }
};
exports.getWorkoutPlan = getWorkoutPlan;
const addWorkoutPlan = async (req, res) => {
    try {
        const { name, planDate, exercises } = req.body;
        if (!name || !planDate || !hasValidExercises(exercises)) {
            res.status(400).json({
                message: 'Name, plan date, and at least one exercise are required',
            });
            return;
        }
        const plan = await (0, workoutPlanService_1.createWorkoutPlan)(getUserId(req), req.body);
        res.status(201).json(plan);
    }
    catch (error) {
        res.status(400).json({
            message: error instanceof Error ? error.message : 'Failed to create workout plan',
        });
    }
};
exports.addWorkoutPlan = addWorkoutPlan;
const editWorkoutPlan = async (req, res) => {
    try {
        if (req.body.exercises && !hasValidExercises(req.body.exercises)) {
            res.status(400).json({
                message: 'Workout plan must have at least one valid exercise',
            });
            return;
        }
        const plan = await (0, workoutPlanService_1.updateWorkoutPlan)(getUserId(req), getPlanId(req), req.body);
        if (!plan) {
            res.status(404).json({ message: 'Workout plan not found' });
            return;
        }
        res.status(200).json(plan);
    }
    catch (error) {
        res.status(400).json({
            message: error instanceof Error ? error.message : 'Failed to update workout plan',
        });
    }
};
exports.editWorkoutPlan = editWorkoutPlan;
const removeWorkoutPlan = async (req, res) => {
    try {
        const plan = await (0, workoutPlanService_1.deleteWorkoutPlan)(getUserId(req), getPlanId(req));
        if (!plan) {
            res.status(404).json({ message: 'Workout plan not found' });
            return;
        }
        res.status(200).json({ message: 'Workout plan deleted' });
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : 'Failed to delete workout plan',
        });
    }
};
exports.removeWorkoutPlan = removeWorkoutPlan;
const toggleWorkoutPlanExerciseStatus = async (req, res) => {
    try {
        const plan = await (0, workoutPlanService_1.toggleWorkoutPlanExercise)(getUserId(req), getPlanId(req), getExerciseId(req));
        if (!plan) {
            res.status(404).json({ message: 'Workout plan or exercise not found' });
            return;
        }
        res.status(200).json(plan);
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error
                ? error.message
                : 'Failed to update workout plan exercise',
        });
    }
};
exports.toggleWorkoutPlanExerciseStatus = toggleWorkoutPlanExerciseStatus;
