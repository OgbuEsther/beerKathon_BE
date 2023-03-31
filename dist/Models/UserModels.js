"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const isEmail_1 = __importDefault(require("validator/lib/isEmail"));
const UserSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Please enter your email"],
        lowercase: true,
        trim: true,
        validate: [isEmail_1.default, "Please enter a valid email"],
    },
    userName: {
        type: String,
        required: [true, "Please enter your Username"],
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    phoneNumber: {
        type: Number,
    },
    password: {
        type: String,
        required: [true, "Please enter your phone number"],
    },
    confirmPassword: {
        type: String,
        required: [true, "Please confirm your password"],
    },
    predict: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "predicts",
        },
    ],
}, { timestamps: true });
exports.default = mongoose_1.default.model("Users", UserSchema);
