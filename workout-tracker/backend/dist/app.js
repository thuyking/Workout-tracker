"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const localeRoutes_1 = __importDefault(require("./routes/localeRoutes"));
const workoutPlanRoutes_1 = __importDefault(require("./routes/workoutPlanRoutes"));
const workoutRoutes_1 = __importDefault(require("./routes/workoutRoutes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/auth', authRoutes_1.default);
app.use('/api/locales', localeRoutes_1.default);
app.use('/api/workout-plans', workoutPlanRoutes_1.default);
app.use('/api/workouts', workoutRoutes_1.default);
exports.default = app;
