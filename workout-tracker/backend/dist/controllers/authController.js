"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const authService_1 = require("../services/authService");
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ message: 'Name, email, and password are required' });
            return;
        }
        const result = await (0, authService_1.registerUser)({ name, email, password });
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({
            message: error instanceof Error ? error.message : 'Registration failed',
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required' });
            return;
        }
        const result = await (0, authService_1.loginUser)({ email, password });
        res.status(200).json(result);
    }
    catch (error) {
        res.status(401).json({
            message: error instanceof Error ? error.message : 'Login failed',
        });
    }
};
exports.login = login;
