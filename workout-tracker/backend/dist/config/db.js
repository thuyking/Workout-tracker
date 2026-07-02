"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDatabase = async () => {
    if (mongoose_1.default.connection.readyState === 1) {
        return;
    }
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUri) {
        throw new Error('MONGO_URI or MONGODB_URI is required in .env');
    }
    await mongoose_1.default.connect(mongoUri);
    console.log('MongoDB connected');
};
exports.connectDatabase = connectDatabase;
