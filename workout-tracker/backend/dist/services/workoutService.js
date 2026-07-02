"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkoutProgress = exports.deleteWorkout = exports.updateWorkout = exports.createWorkout = exports.getWorkoutById = exports.getWorkouts = void 0;
const Workout_1 = require("../models/Workout");
const getWorkouts = async (userId) => {
    return Workout_1.Workout.find({ user: userId }).sort({ workoutDate: -1 });
};
exports.getWorkouts = getWorkouts;
const getWorkoutById = async (userId, workoutId) => {
    return Workout_1.Workout.findOne({ _id: workoutId, user: userId });
};
exports.getWorkoutById = getWorkoutById;
const createWorkout = async (userId, input) => {
    return Workout_1.Workout.create({
        ...input,
        user: userId,
    });
};
exports.createWorkout = createWorkout;
const updateWorkout = async (userId, workoutId, input) => {
    return Workout_1.Workout.findOneAndUpdate({ _id: workoutId, user: userId }, input, { new: true, runValidators: true });
};
exports.updateWorkout = updateWorkout;
const deleteWorkout = async (userId, workoutId) => {
    return Workout_1.Workout.findOneAndDelete({ _id: workoutId, user: userId });
};
exports.deleteWorkout = deleteWorkout;
const normalizeTitle = (title) => title.trim().replace(/\s+/g, ' ').toLowerCase();
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const getStartDate = (range) => {
    const startDate = new Date();
    if (range === '7d') {
        startDate.setDate(startDate.getDate() - 7);
    }
    if (range === '1m') {
        startDate.setMonth(startDate.getMonth() - 1);
    }
    if (range === '1y') {
        startDate.setFullYear(startDate.getFullYear() - 1);
    }
    return startDate;
};
const getAveragePercentChange = (values) => {
    const percentChanges = values.slice(1).reduce((changes, value, index) => {
        const previousValue = values[index];
        if (previousValue === 0) {
            return changes;
        }
        return [...changes, ((value - previousValue) / previousValue) * 100];
    }, []);
    if (percentChanges.length === 0) {
        return null;
    }
    return percentChanges.reduce((sum, change) => sum + change, 0) / percentChanges.length;
};
const calculateMetricProgress = (metric, unit, points) => {
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
        };
    }
    const values = points.map((point) => point.value);
    const firstValue = values[0];
    const lastValue = values[values.length - 1];
    const absoluteChange = lastValue - firstValue;
    const percentChange = firstValue === 0 ? null : (absoluteChange / firstValue) * 100;
    const averageChangePerEntry = absoluteChange / (points.length - 1);
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
        direction: absoluteChange > 0
            ? 'increase'
            : absoluteChange < 0
                ? 'decrease'
                : 'stable',
        points,
    };
};
const getWorkoutProgress = async (userId, workoutId, range) => {
    const workout = await (0, exports.getWorkoutById)(userId, workoutId);
    if (!workout) {
        return null;
    }
    const durationUnit = workout.durationUnit ?? 'minutes';
    const titlePattern = normalizeTitle(workout.title)
        .split(' ')
        .map(escapeRegex)
        .join('\\s+');
    const titleRegex = new RegExp(`^${titlePattern}$`, 'i');
    const endDate = new Date();
    const workouts = await Workout_1.Workout.find({
        user: userId,
        title: titleRegex,
        workoutDate: { $gte: getStartDate(range), $lte: endDate },
    }).sort({ workoutDate: 1 });
    const durationPoints = workouts
        .filter((item) => typeof item.duration === 'number'
        && typeof item.sets === 'number'
        && (item.durationUnit ?? 'minutes') === durationUnit)
        .map((item) => ({
        date: item.workoutDate.toISOString(),
        value: item.duration * item.sets,
    }));
    const volumePoints = workouts
        .filter((item) => typeof item.reps === 'number'
        && typeof item.sets === 'number')
        .map((item) => ({
        date: item.workoutDate.toISOString(),
        value: item.reps * item.sets,
    }));
    return {
        exerciseName: workout.title,
        range,
        durationProgress: calculateMetricProgress('duration', durationUnit, durationPoints),
        volumeProgress: calculateMetricProgress('volume', 'total reps', volumePoints),
    };
};
exports.getWorkoutProgress = getWorkoutProgress;
