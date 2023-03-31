"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteAUser = exports.updateOneUser = exports.UsersLogin = exports.UsersRegistration = exports.GetSingleUser = exports.GetUser = void 0;
const UserModels_1 = __importDefault(require("../Models/UserModels"));
const AppError_1 = require("../Utils/AppError");
const bcrypt_1 = __importDefault(require("bcrypt"));
const AsyncHandler_1 = __importDefault(require("../Utils/AsyncHandler"));
// Get all users:
const GetUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserModels_1.default.find();
        return res.status(200).json({
            message: "All users successfully gotten",
            data: user,
        });
    }
    catch (err) {
        return res.status(404).json({
            message: "An error occured in getting all users",
            data: err.message,
        });
    }
});
exports.GetUser = GetUser;
// Get a single User:
exports.GetSingleUser = (0, AsyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const singleuser = yield UserModels_1.default.findById(req.params.userID).populate({
        path: "predicts",
    });
    if (!singleuser) {
        next(new AppError_1.AppError({
            message: "User not found",
            httpcode: AppError_1.HTTPCODES.NOT_FOUND,
        }));
    }
    return res.status(200).json({
        message: "Successfully got this single user",
        data: singleuser,
    });
}));
// Users Registration:
exports.UsersRegistration = (0, AsyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, phoneNumber, userName, password } = req.body;
    const salt = yield bcrypt_1.default.genSalt(10);
    const hashedPassword = yield bcrypt_1.default.hash(password, salt);
    const findEmail = yield UserModels_1.default.findOne({ email });
    if (findEmail) {
        next(new AppError_1.AppError({
            message: "User with this account already exists",
            httpcode: AppError_1.HTTPCODES.FORBIDDEN,
        }));
    }
    const Users = yield UserModels_1.default.create({
        name,
        email,
        userName,
        phoneNumber: "234" + phoneNumber,
        password: hashedPassword,
        confirmPassword: hashedPassword,
        status: "User",
    });
    return res.status(201).json({
        message: "Successfully created User",
        data: Users,
    });
}));
// Users Login:
exports.UsersLogin = (0, AsyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const CheckEmail = yield UserModels_1.default.findOne({ email });
    if (!CheckEmail) {
        next(new AppError_1.AppError({
            message: "User not Found",
            httpcode: AppError_1.HTTPCODES.NOT_FOUND,
        }));
    }
    const CheckPassword = yield bcrypt_1.default.compare(password, CheckEmail.password);
    if (!CheckPassword) {
        next(new AppError_1.AppError({
            message: "Email or password not correct",
            httpcode: AppError_1.HTTPCODES.CONFLICT,
        }));
    }
    if (CheckEmail && CheckPassword) {
        return res.status(200).json({
            message: "Login Successfull",
            data: CheckEmail,
        });
    }
}));
// Update one user:
exports.updateOneUser = (0, AsyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName } = req.body;
    const user = yield UserModels_1.default.findByIdAndUpdate(req.params.userID, { userName }, { new: true });
    if (!user) {
        next(new AppError_1.AppError({
            message: "An error occured in updating username",
            httpcode: AppError_1.HTTPCODES.INTERNAL_SERVER_ERROR,
        }));
    }
    return res.status(201).json({
        message: "Successfully updated the user's username",
        data: user,
    });
}));
// Delete a user:
exports.DeleteAUser = (0, AsyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield UserModels_1.default.findByIdAndDelete(req.params.userID);
    if (!user) {
        next(new AppError_1.AppError({
            message: "An error occured in deleting this user",
            httpcode: AppError_1.HTTPCODES.INTERNAL_SERVER_ERROR,
        }));
    }
    return res.status(201).json({
        message: "Successfully deleted this user",
        data: user,
    });
}));
