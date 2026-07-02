"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("../models/User");
const generateToken_1 = require("../utils/generateToken");
const registerUser = async ({ name, email, password, }) => {
    const existingUser = await User_1.User.findOne({ email });
    if (existingUser) {
        throw new Error('Email is already registered');
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const user = await User_1.User.create({
        name,
        email,
        password: hashedPassword,
    });
    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
        token: (0, generateToken_1.generateToken)(user.id),
    };
};
exports.registerUser = registerUser;
const loginUser = async ({ email, password, }) => {
    const user = await User_1.User.findOne({ email });
    if (!user) {
        throw new Error('Invalid email or password');
    }
    const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }
    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
        token: (0, generateToken_1.generateToken)(user.id),
    };
};
exports.loginUser = loginUser;
