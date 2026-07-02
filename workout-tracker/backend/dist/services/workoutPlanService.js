"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleWorkoutPlanExercise = exports.deleteWorkoutPlan = exports.updateWorkoutPlan = exports.createWorkoutPlan = exports.getWorkoutPlanById = exports.getWorkoutPlans = void 0;
const Workout_1 = require("../models/Workout");
const WorkoutPlan_1 = require("../models/WorkoutPlan");
const getDateRange = (date) => {
    const startDate = new Date(`${date}T00:00:00.000Z`);
    const endDate = new Date(startDate);
    endDate.setUTCDate(endDate.getUTCDate() + 1);
    return { startDate, endDate };
};
const normalizeExercises = (exercises) => {
    return exercises.map((exercise) => ({
        ...exercise,
        isCompleted: exercise.isCompleted ?? false,
    }));
};
const createWorkoutLogFromPlanExercise = async (userId, plan, exercise) => {
    if (!plan) {
        return null;
    }
    return Workout_1.Workout.create({
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
    });
};
const getWorkoutPlans = async (userId, date) => {
    const query = { user: userId };
    if (date) {
        const { startDate, endDate } = getDateRange(date);
        query.planDate = { $gte: startDate, $lt: endDate };
    }
    return WorkoutPlan_1.WorkoutPlan.find(query).sort({ planDate: -1, createdAt: -1 });
};
exports.getWorkoutPlans = getWorkoutPlans;
const getWorkoutPlanById = async (userId, planId) => {
    return WorkoutPlan_1.WorkoutPlan.findOne({ _id: planId, user: userId });
};
exports.getWorkoutPlanById = getWorkoutPlanById;
const createWorkoutPlan = async (userId, input) => {
    return WorkoutPlan_1.WorkoutPlan.create({
        ...input,
        exercises: normalizeExercises(input.exercises),
        user: userId,
    });
};
exports.createWorkoutPlan = createWorkoutPlan;
const updateWorkoutPlan = async (userId, planId, input) => {
    return WorkoutPlan_1.WorkoutPlan.findOneAndUpdate({ _id: planId, user: userId }, {
        ...input,
        exercises: input.exercises
            ? normalizeExercises(input.exercises)
            : undefined,
    }, { new: true, runValidators: true });
};
exports.updateWorkoutPlan = updateWorkoutPlan;
const deleteWorkoutPlan = async (userId, planId) => {
    return WorkoutPlan_1.WorkoutPlan.findOneAndDelete({ _id: planId, user: userId });
};
exports.deleteWorkoutPlan = deleteWorkoutPlan;
const toggleWorkoutPlanExercise = async (userId, planId, exerciseId) => {
    const plan = await (0, exports.getWorkoutPlanById)(userId, planId);
    if (!plan) {
        return null;
    }
    const exercise = plan.exercises.find((item) => item._id?.toString() === exerciseId);
    if (!exercise) {
        return null;
    }
    if (exercise.isCompleted) {
        exercise.isCompleted = false;
        if (exercise.workoutLog) {
            await Workout_1.Workout.findOneAndDelete({
                _id: exercise.workoutLog,
                user: userId,
            });
            exercise.workoutLog = undefined;
        }
    }
    else {
        exercise.isCompleted = true;
        const workoutLog = await createWorkoutLogFromPlanExercise(userId, plan, exercise);
        exercise.workoutLog = workoutLog?._id;
    }
    await plan.save();
    return plan;
};
exports.toggleWorkoutPlanExercise = toggleWorkoutPlanExercise;
